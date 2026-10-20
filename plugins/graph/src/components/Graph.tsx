import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils/lang"
import { graphTitle } from "../i18n"
import style from "./styles/graph.scss"
// @ts-expect-error - inline script imported as string by the tsup esbuild loader
import script from "./scripts/graph.inline.ts"

export interface D3Config {
  drag: boolean
  zoom: boolean
  depth: number
  scale: number
  repelForce: number
  centerForce: number
  linkDistance: number
  fontSize: number
  opacityScale: number
  removeTags: string[]
  showTags: boolean
  focusOnHover?: boolean
  enableRadial?: boolean
}

/**
 * A course section. Notes carrying any of `tags` (and the `tags/<tag>` nodes
 * themselves) are coloured with `var(cssVar, fallback)` and, in the global
 * graph, pulled towards that section's cluster anchor.
 */
export interface GraphSection {
  id: string
  label: string
  tags: string[]
  cssVar: string
  fallback: string
}

export interface GraphLegendOptions {
  show: boolean
  currentPageLabel: string
}

export interface GraphOptions {
  localGraph?: Partial<D3Config>
  globalGraph?: Partial<D3Config>
  sections?: GraphSection[]
  legend?: Partial<GraphLegendOptions>
}

export const defaultSections: GraphSection[] = [
  {
    id: "lesson",
    label: "Уроки",
    tags: ["lesson"],
    cssVar: "--hub-lesson",
    fallback: "#eec35e",
  },
  {
    id: "homework",
    label: "ДЗ",
    tags: ["homework"],
    cssVar: "--hub-homework",
    fallback: "#d4845a",
  },
  {
    id: "materials",
    label: "Матеріали",
    tags: ["materials"],
    cssVar: "--hub-materials",
    fallback: "#7a9bb8",
  },
  {
    id: "project",
    label: "Проєкти",
    tags: ["project"],
    cssVar: "--hub-project",
    fallback: "#7cb87c",
  },
  {
    id: "case",
    label: "Кейси",
    tags: ["case"],
    cssVar: "--hub-case",
    fallback: "#c47a9e",
  },
  {
    id: "meta",
    label: "Мета",
    tags: ["meta"],
    cssVar: "--hub-meta",
    fallback: "#9a9a9a",
  },
]

const defaultOptions: Required<Pick<GraphOptions, "localGraph" | "globalGraph">> & {
  sections: GraphSection[]
  legend: GraphLegendOptions
} = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: false,
    enableRadial: false,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.2,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    // Radial fights the section clusters; off by default for quartz-ts.
    enableRadial: false,
  },
  sections: defaultSections,
  legend: { show: true, currentPageLabel: "Поточна сторінка" },
}

function Legend({ sections, legend }: { sections: GraphSection[]; legend: GraphLegendOptions }) {
  if (!legend.show) return null
  return (
    <div class="graph-legend" aria-label="Section legend">
      {sections.map((s) => (
        <span class="graph-legend-item" key={s.id}>
          <span
            class="graph-legend-swatch"
            style={`background-color: var(${s.cssVar}, ${s.fallback})`}
            aria-hidden="true"
          ></span>
          {s.label}
        </span>
      ))}
      <span class="graph-legend-item">
        <span class="graph-legend-swatch graph-legend-swatch--current" aria-hidden="true"></span>
        {legend.currentPageLabel}
      </span>
    </div>
  )
}

export default ((userOpts?: Partial<GraphOptions>) => {
  const Graph: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const sections = userOpts?.sections ?? defaultOptions.sections
    const legend = { ...defaultOptions.legend, ...userOpts?.legend }
    // `sections` ride along inside data-cfg so the inline script needs no extra DOM lookups.
    const localGraph = { ...defaultOptions.localGraph, ...userOpts?.localGraph, sections }
    const globalGraph = { ...defaultOptions.globalGraph, ...userOpts?.globalGraph, sections }

    return (
      <div class={classNames(displayClass, "graph")}>
        <h3>{graphTitle(cfg.locale)}</h3>
        <div class="graph-outer">
          <div class="graph-container" data-cfg={JSON.stringify(localGraph)}></div>
          <button class="global-graph-icon" aria-label="Global Graph">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 55 55"
              fill="currentColor"
              xmlSpace="preserve"
            >
              <path
                d="M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17
                s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4
                c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562
                C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829
                c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91
                v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4
                s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665
                C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z M11,9c0-1.103,0.897-2,2-2s2,0.897,2,2s-0.897,2-2,2
                S11,10.103,11,9z M6,51c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S8.206,51,6,51z M33,49c0,2.206-1.794,4-4,4s-4-1.794-4-4
                s1.794-4,4-4S33,46.794,33,49z M29,31c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S32.309,31,29,31z M47,41c0,1.103-0.897,2-2,2
                s-2-0.897-2-2s0.897-2,2-2S47,39.897,47,41z M49,10c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S51.206,10,49,10z"
              />
            </svg>
          </button>
        </div>
        <Legend sections={sections} legend={legend} />
        <div class="global-graph-outer">
          {/* The script clears .global-graph-container on every open, so the
              legend lives next to it, not inside it. */}
          <div class="global-graph-container" data-cfg={JSON.stringify(globalGraph)}></div>
          <Legend sections={sections} legend={legend} />
        </div>
      </div>
    )
  }

  Graph.css = style
  Graph.afterDOMLoaded = script

  return Graph
}) satisfies QuartzComponentConstructor
