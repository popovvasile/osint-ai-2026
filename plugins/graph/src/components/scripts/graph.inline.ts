// @ts-nocheck
// These five helpers are inlined instead of imported from @quartz-community/utils:
// that package's entry pulls preact in, which cannot run inside this browser script.
// Keep them in sync with @quartz-community/utils/dist/{path,dom}.js.

function simplifySlug(fp) {
  if (fp === "index" || fp.endsWith("/index")) fp = fp.slice(0, -"index".length)
  if (fp.startsWith("/")) fp = fp.substring(1)
  if (fp.endsWith("/")) fp = fp.slice(0, -1)
  return fp.length === 0 ? "/" : fp
}

/** Map crawl-links quirks (`/`, `folder/`) onto keys that exist in contentIndex. */
function resolveIndexSlug(slug, validLinks) {
  if (validLinks.has(slug)) return slug
  if (slug === "/" || slug === "") {
    return validLinks.has("index") ? "index" : null
  }
  if (validLinks.has(slug + "/index")) return slug + "/index"
  return null
}

function getFullSlugFromUrl() {
  let rawSlug = decodeURI(window.location.pathname)
  if (rawSlug.endsWith("/")) rawSlug = rawSlug.slice(0, -1)
  if (rawSlug.startsWith("/")) rawSlug = rawSlug.slice(1)
  return rawSlug
}

function getBasePath() {
  if (typeof document === "undefined") return ""
  return (document.body && document.body.dataset && document.body.dataset.basepath) || ""
}

function resolveBasePath(to) {
  const base = getBasePath()
  const slug = to.startsWith("/") ? to : "/" + to
  return base + slug
}

function removeAllChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

;(function () {
  // decode-pathname: decode percent-encoded slugs (Cyrillic titles) so they match
  // contentIndex keys and page titles.
  function decodeSlug(slug) {
    try {
      return decodeURIComponent(slug)
    } catch (e) {
      return slug
    }
  }

  function getSlugFromUrl() {
    var slug = getFullSlugFromUrl()
    var base = getBasePath()
    if (base && slug.startsWith(base.replace(/^\//, ""))) {
      slug = slug.slice(base.replace(/^\//, "").length)
      if (slug.startsWith("/")) slug = slug.slice(1)
    }
    return decodeSlug(slug)
  }

  function loadScript(src) {
    var existing = document.querySelector('script[src="' + src + '"]')
    if (existing) return Promise.resolve()
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script")
      script.src = src
      script.crossOrigin = "anonymous"
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  Promise.all([
    loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
    loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
  ])
    .then(function () {
      initGraph()
    })
    .catch(function (err) {
      console.error("[Graph] Failed to load libraries:", err)
      var containers = document.querySelectorAll(".graph-container")
      for (var i = 0; i < containers.length; i++) {
        containers[i].textContent = "Graph could not load. Check your network connection."
        containers[i].style.display = "flex"
        containers[i].style.alignItems = "center"
        containers[i].style.justifyContent = "center"
        containers[i].style.color = "var(--gray)"
        containers[i].style.fontSize = "0.9rem"
      }
    })

  function initGraph() {
    var d3 = window.d3
    var PIXI = window.PIXI

    if (!d3 || !PIXI) {
      console.error("[Graph] Libraries not loaded")
      return
    }

    var localStorageKey = "graph-visited"

    function getVisited() {
      return new Set(JSON.parse(localStorage.getItem(localStorageKey) || "[]"))
    }

    function addToVisited(slug) {
      var visited = getVisited()
      visited.add(slug)
      localStorage.setItem(localStorageKey, JSON.stringify(Array.from(visited)))
    }

    // Resolves CSS color values containing calc()/var() that PixiJS cannot parse.
    // Uses a temp DOM element so the browser's CSS engine evaluates the expression.
    function resolveColor(value, fallback) {
      if (!value) return fallback
      var el = document.createElement("div")
      el.style.color = value
      el.style.position = "absolute"
      el.style.visibility = "hidden"
      document.body.appendChild(el)
      var resolved = getComputedStyle(el).color
      el.remove()
      return resolved || fallback
    }

    async function renderGraph(graph, fullSlug, renderGeneration) {
      // slug-and-mode: body[data-slug] is authoritative (the URL can be a folder
      // path or percent-encoded); isGlobal switches layout between the two graphs.
      var bodySlug = document.body && document.body.dataset.slug
      var slug = decodeSlug(simplifySlug(bodySlug || fullSlug))
      if (slug === "") slug = "index"
      var isGlobal = !!graph.closest(".global-graph-container")
      var visited = getVisited()
      removeAllChildren(graph)

      if (renderGeneration !== undefined && renderGeneration !== currentRenderGeneration) {
        console.log("[Graph] Stale render, skipping")
        return function () {}
      }

      var config = JSON.parse(graph.dataset["cfg"] || "{}")
      var enableDrag = config.drag
      var enableZoom = config.zoom
      var depth = config.depth
      var scale = config.scale || 1
      var repelForce = config.repelForce || 0.5
      var centerForce = config.centerForce || 0.3
      var linkDistance = config.linkDistance || 30
      var fontSize = config.fontSize || 0.6
      var opacityScale = config.opacityScale || 1
      var removeTags = config.removeTags || []
      var showTags = config.showTags
      var focusOnHover = config.focusOnHover
      var enableRadial = config.enableRadial
      // sections: [{ id, label, tags, cssVar, fallback }] from data-cfg (see Graph.tsx).
      var sections = config.sections || []

      var data
      try {
        var dataRaw = await fetchData
        data = new Map()
        for (var key in dataRaw) {
          data.set(decodeSlug(simplifySlug(key)), dataRaw[key])
        }
      } catch (err) {
        console.error("[Graph] Error loading data:", err)
        return function () {}
      }

      // Global modal may still report 0×0 if measured in the same tick as
      // display:none → active; fall back to the CSS 80vw / 80vh targets.
      var width = graph.offsetWidth || Math.floor(window.innerWidth * 0.8)
      var height = Math.max(graph.offsetHeight, 250)
      if (isGlobal && graph.offsetHeight < 100) {
        height = Math.floor(window.innerHeight * 0.8)
      }

      var links = []
      var allTags = []
      var validLinks = new Set(data.keys())

      data.forEach(function (details, source) {
        var outgoing = details.links || []
        for (var i = 0; i < outgoing.length; i++) {
          var dest = resolveIndexSlug(simplifySlug(outgoing[i]), validLinks)
          if (dest) {
            links.push({ source: source, target: dest })
          }
        }

        if (showTags) {
          var tags = details.tags || []
          for (var i = 0; i < tags.length; i++) {
            var tag = tags[i]
            if (removeTags.indexOf(tag) === -1) {
              var tagSlug = simplifySlug("tags/" + tag)
              if (allTags.indexOf(tagSlug) === -1) {
                allTags.push(tagSlug)
              }
              links.push({ source: source, target: tagSlug })
            }
          }
        }
      })

      var neighbourhood = new Set()
      if (depth >= 0) {
        var queue = [slug]
        var seen = new Set([slug])
        for (var d = 0; d <= depth && queue.length > 0; d++) {
          var nextQueue = []
          for (var qi = 0; qi < queue.length; qi++) {
            var cur = queue[qi]
            neighbourhood.add(cur)
            for (var li = 0; li < links.length; li++) {
              var link = links[li]
              if (link.source === cur && !seen.has(link.target)) {
                seen.add(link.target)
                nextQueue.push(link.target)
              }
              if (link.target === cur && !seen.has(link.source)) {
                seen.add(link.source)
                nextQueue.push(link.source)
              }
            }
          }
          queue = nextQueue
        }
      } else {
        validLinks.forEach(function (id) {
          neighbourhood.add(id)
        })
        for (var i = 0; i < allTags.length; i++) {
          neighbourhood.add(allTags[i])
        }
      }

      // skip-tag-index: the "tags/" listing node is not a real tag and only adds noise.
      neighbourhood.delete("tags/")
      neighbourhood.delete("tags")

      // Section helpers MUST be defined before node seeding — global graph calls
      // clusterX/clusterY while building initial positions (local graph does not).
      function sectionIndexOf(tags, isTag) {
        for (var si = 0; si < sections.length; si++) {
          var secTags = sections[si].tags
          for (var ti = 0; ti < tags.length; ti++) {
            if (secTags.indexOf(tags[ti]) !== -1) return si
          }
        }
        return isTag ? sections.length : -1
      }

      function sectionTagsOf(d) {
        if (d.id.startsWith("tags/")) return [d.id.substring(5)]
        return d.tags || []
      }

      function sectionIndexOfNode(d) {
        return sectionIndexOf(sectionTagsOf(d), d.id.startsWith("tags/"))
      }

      // cluster-seed / cluster-force: 3×2 grid for course sections, then leftover
      // tag nodes in the middle. Order matches config `sections`.
      var clusterAnchorsX = [-0.35, 0, 0.35, -0.35, 0, 0.35, 0]
      var clusterAnchorsY = [-0.32, -0.32, -0.32, 0.32, 0.32, 0.32, 0]

      function clusterX(index, w) {
        if (index < 0) index = clusterAnchorsX.length - 1
        return clusterAnchorsX[Math.min(index, clusterAnchorsX.length - 1)] * w
      }

      function clusterY(index, h) {
        if (index < 0) index = clusterAnchorsY.length - 1
        return clusterAnchorsY[Math.min(index, clusterAnchorsY.length - 1)] * h
      }

      var nodes = []
      var nodeMap = new Map()
      neighbourhood.forEach(function (url) {
        var isTag = url.startsWith("tags/")
        var entry = data.get(url)
        // decode-pathname: fall back to a decoded slug when the index has no title.
        var text = isTag ? "#" + url.substring(5) : entry?.title || decodeSlug(url)
        var nodeTags = isTag ? [] : entry?.tags || []
        // cluster-seed: global graph starts each section in its own quadrant;
        // the local sidebar graph stays a tight random cloud.
        var cluster = sectionIndexOf(isTag ? [url.substring(5)] : nodeTags, isTag)
        var x = isGlobal
          ? clusterX(cluster, width) + (Math.random() - 0.5) * 0.18 * width
          : (Math.random() - 0.5) * 0.28 * width
        var y = isGlobal
          ? clusterY(cluster, height) + (Math.random() - 0.5) * 0.18 * height
          : (Math.random() - 0.5) * 0.28 * height
        var node = {
          id: url,
          text: text,
          tags: nodeTags,
          x: x,
          y: y,
          vx: 0,
          vy: 0,
        }
        nodes.push(node)
        nodeMap.set(url, node)
      })

      var graphLinks = []
      for (var i = 0; i < links.length; i++) {
        var link = links[i]
        if (neighbourhood.has(link.source) && neighbourhood.has(link.target)) {
          var sourceNode = nodeMap.get(link.source)
          var targetNode = nodeMap.get(link.target)
          if (sourceNode && targetNode) {
            graphLinks.push({ source: sourceNode, target: targetNode })
          }
        }
      }

      var styles = getComputedStyle(document.documentElement)
      var secondary = resolveColor(styles.getPropertyValue("--secondary").trim(), "#c792ea")
      var tertiary = resolveColor(styles.getPropertyValue("--tertiary").trim(), "#82aaff")
      var gray = resolveColor(styles.getPropertyValue("--gray").trim(), "#6c6c6c")
      var lightgray = resolveColor(styles.getPropertyValue("--lightgray").trim(), "#d4d4d4")
      var dark = resolveColor(styles.getPropertyValue("--dark").trim(), "#1a1a1a")
      var light = resolveColor(styles.getPropertyValue("--light").trim(), "#f5f5f5")
      var bodyFont = styles.getPropertyValue("--bodyFont").trim() || "inherit"

      // colors: one resolved colour per section, in config order.
      var sectionColors = []
      for (var si = 0; si < sections.length; si++) {
        var sec = sections[si]
        sectionColors.push(resolveColor(styles.getPropertyValue(sec.cssVar).trim(), sec.fallback))
      }

      var app = new PIXI.Application()
      await app.init({
        width: width,
        height: height,
        antialias: true,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        eventMode: "static",
      })

      graph.appendChild(app.canvas)

      var stage = new PIXI.Container()
      app.stage.addChild(stage)

      var simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-100 * repelForce))
        .force("center", d3.forceCenter().strength(centerForce))
        .force("link", d3.forceLink(graphLinks).distance(linkDistance))
        .force(
          "collide",
          d3
            .forceCollide()
            .radius(function (d) {
              var numLinks = 0
              for (var i = 0; i < graphLinks.length; i++) {
                if (graphLinks[i].source.id === d.id || graphLinks[i].target.id === d.id) {
                  numLinks++
                }
              }
              return 2 + Math.sqrt(numLinks)
            })
            .iterations(3),
        )

      // cluster-force: only the global graph is pulled into section clusters.
      if (isGlobal) {
        simulation
          .force(
            "clusterX",
            d3
              .forceX(function (d) {
                return clusterX(sectionIndexOfNode(d), width)
              })
              .strength(0.14),
          )
          .force(
            "clusterY",
            d3
              .forceY(function (d) {
                return clusterY(sectionIndexOfNode(d), height)
              })
              .strength(0.14),
          )
      }

      // cluster-force: radial is weakened so it doesn't fight the clusters.
      if (enableRadial) {
        var radius = (Math.min(width, height) / 2) * 0.8
        simulation.force("radial", d3.forceRadial(radius).strength(0.08))
      }

      var linkContainer = new PIXI.Container()
      var nodesContainer = new PIXI.Container()
      var labelsContainer = new PIXI.Container()
      stage.addChild(linkContainer)
      stage.addChild(nodesContainer)
      stage.addChild(labelsContainer)

      var nodeRenderData = []
      var linkRenderData = []
      var hoveredNodeId = null
      var hoveredNeighbours = new Set()
      var dragStartTime = 0
      var dragging = false
      var currentTransform = d3.zoomIdentity

      function nodeRadius(d) {
        var numLinks = 0
        for (var i = 0; i < graphLinks.length; i++) {
          if (graphLinks[i].source.id === d.id || graphLinks[i].target.id === d.id) {
            numLinks++
          }
        }
        return 2 + Math.sqrt(numLinks)
      }

      // section-color: section fill wins; the current page keeps its section colour
      // and is marked with a ring instead of being recoloured.
      function nodeColor(d) {
        var idx = sectionIndexOfNode(d)
        if (idx >= 0 && idx < sectionColors.length) return sectionColors[idx]
        if (visited.has(d.id) || d.id.startsWith("tags/")) return tertiary
        return gray
      }

      function updateHoverInfo(newHoveredId) {
        hoveredNodeId = newHoveredId

        if (newHoveredId === null) {
          hoveredNeighbours = new Set()
          for (var i = 0; i < nodeRenderData.length; i++) {
            nodeRenderData[i].active = false
          }
          for (var i = 0; i < linkRenderData.length; i++) {
            linkRenderData[i].active = false
          }
        } else {
          hoveredNeighbours = new Set()

          for (var i = 0; i < linkRenderData.length; i++) {
            var linkData = linkRenderData[i].simulationData
            if (linkData.source.id === newHoveredId || linkData.target.id === newHoveredId) {
              hoveredNeighbours.add(linkData.source.id)
              hoveredNeighbours.add(linkData.target.id)
              linkRenderData[i].active = true
            } else {
              linkRenderData[i].active = false
            }
          }

          hoveredNeighbours.add(newHoveredId)

          for (var i = 0; i < nodeRenderData.length; i++) {
            if (hoveredNeighbours.has(nodeRenderData[i].simulationData.id)) {
              nodeRenderData[i].active = true
            } else {
              nodeRenderData[i].active = false
            }
          }
        }
      }

      function renderLinks() {
        for (var i = 0; i < linkRenderData.length; i++) {
          var linkData = linkRenderData[i]
          var alpha = 1
          if (hoveredNodeId !== null) {
            alpha = linkData.active ? 1 : 0.2
          }
          linkData.alpha = alpha
          // Prefer --gray over --lightgray: in dark mode lightgray ≈ panel bg,
          // so edges vanish in the global graph.
          linkData.color = linkData.active ? tertiary : gray
        }
      }

      function renderLabels() {
        var defaultScale = 1 / scale
        var activeScale = defaultScale * 1.1

        for (var i = 0; i < nodeRenderData.length; i++) {
          var nodeData = nodeRenderData[i]
          if (hoveredNodeId === nodeData.simulationData.id) {
            nodeData.label.alpha = 1
            nodeData.label.scale.set(activeScale)
          } else {
            nodeData.label.scale.set(defaultScale)
          }
        }
      }

      function renderNodes() {
        for (var i = 0; i < nodeRenderData.length; i++) {
          var nodeData = nodeRenderData[i]
          var alpha = 1
          if (hoveredNodeId !== null && focusOnHover) {
            alpha = nodeData.active ? 1 : 0.2
          }
          nodeData.gfx.alpha = alpha
        }
      }

      function renderPixiFromD3() {
        renderNodes()
        renderLinks()
        renderLabels()
      }

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i]
        var nodeId = node.id
        var isTagNode = nodeId.startsWith("tags/")
        var radius = nodeRadius(node)
        var color = nodeColor(node)

        var label = new PIXI.Text({
          text: node.text,
          style: {
            fontSize: fontSize * 15,
            fill: dark,
            fontFamily: bodyFont,
          },
          resolution: window.devicePixelRatio * 4,
        })
        label.anchor.set(0.5, 1.2)
        // local-current-label: the current page label is always visible in the
        // local graph; everything else stays hidden until hover.
        label.alpha = nodeId === slug && !isGlobal ? 1 : 0
        label.scale.set(1 / scale)
        labelsContainer.addChild(label)

        var gfx = new PIXI.Graphics()
        gfx.circle(0, 0, radius)
        // fill-and-ring: section tag nodes keep their section fill (the old
        // light-fill + tertiary stroke only applies to non-section tags).
        var sectionTag = isTagNode && sectionIndexOfNode(node) < sectionColors.length
        gfx.fill({ color: isTagNode && !sectionTag ? light : color })
        if (isTagNode && !sectionTag) {
          gfx.stroke({ width: 2, color: tertiary })
        }
        if (nodeId === slug) {
          gfx.stroke({ width: 2.5, color: secondary })
        }

        gfx.eventMode = "static"
        gfx.cursor = "pointer"
        gfx.label = nodeId

        ;(function (n, g, labelRef) {
          var oldLabelOpacity = 0
          g.on("pointerover", function (e) {
            updateHoverInfo(n.id)
            oldLabelOpacity = labelRef.alpha
            if (!dragging) {
              renderPixiFromD3()
            }
          })

          g.on("pointerleave", function () {
            updateHoverInfo(null)
            labelRef.alpha = oldLabelOpacity
            if (!dragging) {
              renderPixiFromD3()
            }
          })
        })(node, gfx, label)

        nodesContainer.addChild(gfx)

        nodeRenderData.push({
          simulationData: node,
          gfx: gfx,
          label: label,
          color: color,
          alpha: 1,
          active: false,
        })
      }

      for (var i = 0; i < graphLinks.length; i++) {
        var link = graphLinks[i]
        var gfx = new PIXI.Graphics()
        gfx.eventMode = "none"
        linkContainer.addChild(gfx)

        linkRenderData.push({
          simulationData: link,
          gfx: gfx,
          color: gray,
          alpha: 1,
          active: false,
        })
      }

      if (enableDrag) {
        var dragSubject = function (event) {
          var mouseX = (event.x - currentTransform.x) / currentTransform.k
          var mouseY = (event.y - currentTransform.y) / currentTransform.k

          for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i]
            var dx = mouseX - n.x - width / 2
            var dy = mouseY - n.y - height / 2
            var dist = Math.sqrt(dx * dx + dy * dy)
            var rad = nodeRadius(n)
            if (dist < rad + 5) {
              return n
            }
          }
          return null
        }

        var dragStarted = function (event) {
          if (!event.active) simulation.alphaTarget(1).restart()
          event.subject.fx = event.subject.x
          event.subject.fy = event.subject.y
          var mouseSimX = (event.x - currentTransform.x) / currentTransform.k - width / 2
          var mouseSimY = (event.y - currentTransform.y) / currentTransform.k - height / 2
          event.subject.__dragOffset = {
            x: mouseSimX - event.subject.x,
            y: mouseSimY - event.subject.y,
          }
          dragStartTime = Date.now()
          dragging = true
          hoveredNodeId = event.subject.id
        }

        var dragDragged = function (event) {
          var mouseSimX = (event.x - currentTransform.x) / currentTransform.k - width / 2
          var mouseSimY = (event.y - currentTransform.y) / currentTransform.k - height / 2
          event.subject.fx = mouseSimX - event.subject.__dragOffset.x
          event.subject.fy = mouseSimY - event.subject.__dragOffset.y
        }

        var dragEnded = function (event) {
          if (!event.active) simulation.alphaTarget(0)
          event.subject.fx = null
          event.subject.fy = null
          dragging = false
          updateHoverInfo(null)
          renderPixiFromD3()

          if (Date.now() - dragStartTime < 500) {
            var target = resolveBasePath(event.subject.id)
            window.location.href = target
          }
        }

        var drag = d3
          .drag()
          .container(app.canvas)
          .subject(dragSubject)
          .on("start", dragStarted)
          .on("drag", dragDragged)
          .on("end", dragEnded)

        d3.select(app.canvas).call(drag)
      } else {
        for (var i = 0; i < nodeRenderData.length; i++) {
          ;(function (nodeData) {
            nodeData.gfx.on("click", function () {
              var target = resolveBasePath(nodeData.simulationData.id)
              window.location.href = target
            })
          })(nodeRenderData[i])
        }
      }

      if (enableZoom) {
        var zoomed = function (event) {
          currentTransform = event.transform
          stage.scale.set(currentTransform.k, currentTransform.k)
          stage.position.set(currentTransform.x, currentTransform.y)

          var newScale = currentTransform.k * opacityScale
          var scaleOpacity = Math.max((newScale - 1) / 3.75, 0)

          // zoom-labels: hovered labels stay fully visible; in the local graph the
          // current page label stays visible too; the rest fade with zoom in the
          // global graph and stay hidden in the local graph.
          for (var i = 0; i < nodeRenderData.length; i++) {
            var nodeData = nodeRenderData[i]
            if (!nodeData.label) continue
            if (nodeData.active) {
              nodeData.label.alpha = 1
              continue
            }
            if (!isGlobal && nodeData.simulationData.id === slug) {
              nodeData.label.alpha = 1
              continue
            }
            nodeData.label.alpha = isGlobal ? scaleOpacity : 0
          }
        }

        var zoom = d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([0.25, 4])
          .on("zoom", zoomed)

        d3.select(app.canvas).call(zoom)
      }

      var stopAnimation = false
      function animate() {
        if (stopAnimation) return

        for (var i = 0; i < nodeRenderData.length; i++) {
          var n = nodeRenderData[i]
          var x = n.simulationData.x
          var y = n.simulationData.y
          if (x != null && y != null) {
            n.gfx.position.set(x + width / 2, y + height / 2)
            if (n.label) {
              n.label.position.set(x + width / 2, y + height / 2)
            }
          }
        }

        for (var i = 0; i < linkRenderData.length; i++) {
          var l = linkRenderData[i]
          var linkData = l.simulationData
          var sx = linkData.source.x
          var sy = linkData.source.y
          var tx = linkData.target.x
          var ty = linkData.target.y
          if (sx != null && sy != null && tx != null && ty != null) {
            l.gfx.clear()
            l.gfx.moveTo(sx + width / 2, sy + height / 2)
            l.gfx.lineTo(tx + width / 2, ty + height / 2)
            l.gfx.stroke({ alpha: l.alpha, width: 1, color: l.color })
          }
        }

        requestAnimationFrame(animate)
      }

      simulation.on("tick", function () {})
      simulation.restart()
      renderPixiFromD3()
      animate()

      return function () {
        stopAnimation = true
        simulation.stop()
        try {
          app.destroy(true)
        } catch (_) {
          // PixiJS may throw if WebGL context was already lost.
        }
      }
    }

    var localCleanups = []
    var globalCleanups = []
    var currentRenderGeneration = 0

    function cleanupLocal() {
      for (var i = 0; i < localCleanups.length; i++) {
        localCleanups[i]()
      }
      localCleanups = []
    }

    function cleanupGlobal() {
      for (var i = 0; i < globalCleanups.length; i++) {
        globalCleanups[i]()
      }
      globalCleanups = []
    }

    var globalContainers = []
    var globalIcons = []
    var documentClickHandler = null
    var documentKeydownHandler = null
    var iconClickHandler = null

    function hideGlobalGraph() {
      cleanupGlobal()
      for (var i = 0; i < globalContainers.length; i++) {
        globalContainers[i].classList.remove("active")
        var sidebar = globalContainers[i].closest(".sidebar")
        if (sidebar) {
          sidebar.style.zIndex = ""
        }
      }
    }

    function anyGlobalGraphActive() {
      for (var i = 0; i < globalContainers.length; i++) {
        if (globalContainers[i].classList.contains("active")) {
          return true
        }
      }
      return false
    }

    function showGlobalGraph() {
      cleanupGlobal()
      var currentSlug = getSlugFromUrl()
      for (var i = 0; i < globalContainers.length; i++) {
        var container = globalContainers[i]
        container.classList.add("active")
        var sidebar = container.closest(".sidebar")
        if (sidebar) {
          sidebar.style.zIndex = "1"
        }

        var graphContainer = container.querySelector(".global-graph-container")
        if (graphContainer) {
          ;(function (gc) {
            renderGraph(gc, currentSlug, undefined)
              .then(function (cleanup) {
                globalCleanups.push(cleanup)
              })
              .catch(function (err) {
                console.error("[Graph] Global render error:", err)
              })
          })(graphContainer)
        }
      }
    }

    function toggleGlobalGraph() {
      if (anyGlobalGraphActive()) {
        hideGlobalGraph()
      } else {
        showGlobalGraph()
      }
    }

    function renderLocal() {
      cleanupLocal()
      var thisGeneration = ++currentRenderGeneration
      var slug = getSlugFromUrl()
      addToVisited(slug)

      var localContainers = document.querySelectorAll(".graph-container")
      for (var i = 0; i < localContainers.length; i++) {
        ;(function (container) {
          renderGraph(container, slug, thisGeneration)
            .then(function (cleanup) {
              if (thisGeneration === currentRenderGeneration) {
                localCleanups.push(cleanup)
              }
            })
            .catch(function (err) {
              console.error("[Graph] Local render error:", err)
            })
        })(localContainers[i])
      }
    }

    function handleNav(e) {
      var slug = e.detail ? e.detail.url : getSlugFromUrl()
      addToVisited(decodeSlug(simplifySlug(slug)))

      renderLocal()

      globalContainers = Array.from(document.querySelectorAll(".global-graph-outer"))

      if (iconClickHandler) {
        for (var i = 0; i < globalIcons.length; i++) {
          globalIcons[i].removeEventListener("click", iconClickHandler)
        }
      }

      globalIcons = Array.from(document.querySelectorAll(".global-graph-icon"))
      iconClickHandler = function () {
        toggleGlobalGraph()
      }
      for (var i = 0; i < globalIcons.length; i++) {
        globalIcons[i].addEventListener("click", iconClickHandler)
      }

      if (documentClickHandler) {
        document.removeEventListener("click", documentClickHandler)
      }
      documentClickHandler = function (e) {
        if (anyGlobalGraphActive()) {
          var inContainer = e.target.closest(".global-graph-container")
          var inIcon = e.target.closest(".global-graph-icon")
          if (!inContainer && !inIcon) {
            hideGlobalGraph()
          }
        }
      }
      document.addEventListener("click", documentClickHandler)

      if (documentKeydownHandler) {
        document.removeEventListener("keydown", documentKeydownHandler)
      }
      documentKeydownHandler = function (e) {
        if (e.key === "Escape") {
          if (anyGlobalGraphActive()) {
            hideGlobalGraph()
          }
          return
        }

        if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
          e.preventDefault()
          toggleGlobalGraph()
        }
      }
      document.addEventListener("keydown", documentKeydownHandler)

      if (anyGlobalGraphActive()) {
        showGlobalGraph()
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        handleNav({ detail: { url: getSlugFromUrl() } })
      })
    } else {
      handleNav({ detail: { url: getSlugFromUrl() } })
    }
    document.addEventListener("prenav", function () {
      cleanupLocal()
      cleanupGlobal()
    })
    document.addEventListener("nav", handleNav)
    document.addEventListener("render", handleNav)

    function handleThemeChange() {
      renderLocal()
      if (anyGlobalGraphActive()) {
        showGlobalGraph()
      }
    }
    document.addEventListener("themechange", handleThemeChange)
  }
})()
