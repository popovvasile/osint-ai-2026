# Mapping Telegram Networks: Build a Full OSINT Graph Pipeline with Groupint, Neo4j, Gephi, and Claude

*A step-by-step tutorial for investigators who want to move from raw Telegram data to AI-analyzed community structure — entirely on local infrastructure.*

---

A Telegram network does not reveal itself through reading. You can spend days scrolling a group's messages and still miss the structural reality: which accounts are bridging separate communities, which channels are amplifying each other, and where the actual coordination is happening. That structure is invisible in a feed. It becomes visible the moment you turn it into a graph.

This tutorial builds the complete pipeline: from registering an anonymous Telegram account to a fully analyzed, publication-ready network visualization with AI-generated community annotations — using four tools that hand off to each other cleanly.

**What you will have built by the end:**

A live graph in Gephi Desktop where nodes are Telegram users and groups, edges are membership and endorsement relationships, communities are color-coded by AI-detected modularity class, and Claude has annotated the highest-influence nodes. The whole thing runs on your machine. Nothing leaves it.

---

## The Pipeline at a Glance

```
Grizzly SMS (virtual number)
        │
        ▼
Telegram account + API credentials (my.telegram.org)
        │
        ▼
Groupint (Docker) — scrapes members, messages, endorsements
        │
        ▼
Neo4j (Docker, bundled with Groupint)
        │
        ▼
Gephi Desktop + Neo4j plugin — import and layout
        │
        ▼
gephi-ai (Java plugin + Python MCP server)
        │
        ▼
Claude — modularity, centrality, annotated export
```

Seven stages. Each one produces output that feeds the next. No stage requires you to write data transformation code from scratch.

---

## Prerequisites

- Docker Desktop installed and running
- Gephi Desktop 0.10.1 or newer (download from gephi.org)
- JDK 11+ and Maven (for building the gephi-ai Java plugin)
- Python 3.10+
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
- A few dollars of Grizzly SMS credit (typically $0.10–0.50 per number)

---

## Stage 1: Anonymous Telegram Account Setup

You do not want to use your personal Telegram account for OSINT scraping. If a target group bans your account, you lose access. If Telegram flags the API activity, you lose your primary number. Use a dedicated research account from the start.

### Get a virtual number

Go to [grizzlysms.com/telegram](https://grizzlysms.com/telegram). Register, add credit, and buy a number. Choose the country deliberately: if your target community is Russian-language, a Russian or Ukrainian number may face fewer API restrictions from Telegram's side. Copy the number in full international format: `+37360123456`.

**Do not close the Grizzly SMS browser tab** until you have finished the next two steps. Virtual number activations expire.

### Register the Telegram account

Open the Telegram app (desktop or mobile), enter your Grizzly number, and wait for the SMS code. Go back to the Grizzly SMS dashboard — under "SMS / Activations" the code appears within 30–60 seconds. Enter it in Telegram. Set a display name. Username is optional but useful for later reference.

### Generate API credentials

Open [my.telegram.org/apps](https://my.telegram.org/apps) in a browser and log in with the same number. Navigate to "API development tools" and create a new application:

- **App title:** anything (e.g. `GroupintResearch`)
- **Short name:** lowercase, no spaces (e.g. `groupint`)
- **Platform:** Desktop

After saving, you get two values:

```
api_id:   12345678         (a number)
api_hash: a3f8b2c1...      (32-character hex string)
```

Save both in a password manager. These are your Telethon credentials — every Groupint session will use them.

**Common failure:** using the wrong field for each. `api_id` is always numeric. `api_hash` is always a hex string. They are not interchangeable.

---

## Stage 2: Deploy Groupint

Groupint is an open-source Telegram scraping tool built by [OSINT for Ukraine](https://github.com/OSINT-for-Ukraine/groupint). It wraps Telethon in a Streamlit UI and stores everything directly into a Neo4j graph database. The Docker stack ships Neo4j bundled — you run one command and both services start.

### Clone and configure

```bash
git clone https://github.com/OSINT-for-Ukraine/groupint.git
cd groupint
```

Create the secrets file. This is the only configuration step:

```bash
mkdir -p .streamlit
cat > .streamlit/secrets.toml << 'EOF'
[telegram]
phone    = "+37360123456"
api_id   = "12345678"
api_hash = "a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5"
EOF
```

Replace with your actual values. This file **must never be committed to git** — add it to `.gitignore` if you fork the repo.

### Start the stack

```bash
chmod +x scripts/up-desktop.sh
./scripts/up-desktop.sh
```

This starts two containers:

| Container | Purpose |
|---|---|
| `groupint-streamlit` | The Streamlit UI at `localhost:18501` |
| `groupint-neo4j` | Neo4j graph database |

Wait for both to be healthy, then open your browser at **http://localhost:18501**.

### Port reference

This is where most people hit problems. The desktop stack uses non-standard ports to avoid conflicts with other Neo4j instances you might have running:

| Service | Desktop stack | Legacy stack |
|---|---|---|
| Groupint UI | `localhost:18501` | `localhost:8501` |
| Neo4j Browser | `localhost:17474` | `localhost:7474` |
| Neo4j Bolt (for Gephi) | `bolt://localhost:17687` | `bolt://localhost:7687` |
| gephi-ai API | `127.0.0.1:8080` | same |

**Always use 17687 for Gephi**, not 7687. This is the most common reason the Neo4j plugin fails to connect.

### Authenticate Groupint

In the Streamlit UI, you'll see a form pre-filled from `secrets.toml`. Click **Create / connect Telegram client**. If this is a fresh session, Telegram sends a code to your account (in the Telegram app, not SMS this time). Enter it in the UI and click **Verify secret code**.

The session is saved to a `.string` file in the Docker volume. On subsequent visits, Groupint auto-reconnects without asking for a code.

**Verify the connection works** by running this against Neo4j:

```bash
docker exec groupint-neo4j cypher-shell -a bolt://localhost:7687 \
  "MATCH (n) RETURN count(n) AS total"
```

At this point it should return `0` — the database is empty and waiting.

---

## Stage 3: Scrape Your Target Group

In the Groupint UI, enter your target in the **Target group** field. You can use:

- A public username: `@durov`
- A full URL: `https://t.me/some_public_group`
- A group invite link (if you have one)

Then collect data in this order:

**Step 1 — Members**
Click **Get users list**. Groupint calls the Telegram API, pulls the member list, and writes each account as a `User` node in Neo4j. Each user gets a `MEMBER_OF` edge to the `Group` node. This is the membership graph.

**Step 2 — Messages**
Click **Get messages from group**. This pulls recent messages and stores them as `Message` nodes. Then click **Extract users from stored messages** — this creates `User` nodes for anyone who posted (some active members may not appear in the member list if they joined and left).

**Step 3 — Endorsements** (optional, high value)
Click **Extract endorsements**. Groupint scans messages for links to other Telegram groups and channels, then creates `ENDORSES` edges between `Group` nodes. This reveals the referral network — which channels are directing their audiences toward each other.

After scraping, verify what you have:

```bash
docker exec groupint-neo4j cypher-shell -a bolt://localhost:7687 \
  "MATCH (g:Group) RETURN g.title, g.user_counts"
```

```bash
docker exec groupint-neo4j cypher-shell -a bolt://localhost:7687 \
  "MATCH ()-[r]->() RETURN type(r), count(r) AS total"
```

The second query shows you edge counts by type: `MEMBER_OF`, `IN_GROUP`, `ENDORSES`. If `MEMBER_OF` count is 0, the scrape did not complete.

---

## Stage 4: Import into Gephi

Gephi is where the graph becomes visible. Install the Neo4j plugin from the Gephi plugin manager (**Tools → Plugins → Available Plugins**, search for "Neo4j") or download it from gephi.org/desktop/plugins/neo4j-plugin/.

Restart Gephi after installing the plugin.

### Connect to Neo4j

Go to **File → Import → Neo4j** (location varies slightly by Gephi version; check the File menu and the Import submenu).

In the connection dialog:

```
URL:            neo4j://localhost:17687
Authentication: No authentication
Database:       (leave empty)
```

Click **Verify**. Wait for the green confirmation. If it fails, check that `groupint-neo4j` is running (`docker ps`) and that you are using port **17687**, not 7687.

Only click **Next** after a successful verify.

### Select what to import

On the **Labels & Relationship types** tab:

- **Node labels:** select `User` and `Group` (leave out `Message` for any graph over a few hundred nodes — it will make Gephi unresponsive)
- **Relationship types:** select `MEMBER_OF` and `ENDORSES`

Complete the import. Gephi builds the graph in memory. You should see nodes appearing in the graph view.

Save the project immediately: **File → Save** → `groupint-analysis.gephi`.

### Alternative: Custom Cypher import

If you want a filtered view — for example, only users with more than 5 memberships — use the **Nodes & Edges queries** tab instead:

**Nodes:**
```cypher
MATCH (n) WHERE n:User OR n:Group
RETURN id(n) AS id, labels(n)[0] AS label, coalesce(n.username, n.title, n.id) AS name
```

**Edges:**
```cypher
MATCH (u:User)-[r:MEMBER_OF]->(g:Group)
RETURN id(r) AS id, type(r) AS type, id(u) AS sourceId, id(g) AS targetId
```

On Neo4j 5+, if `id()` causes import errors, replace it with `elementId()`.

---

## Stage 5: Layout and Basic Visualization

The raw import dumps all nodes at position (0,0). You need a layout algorithm to spread them out so structure becomes visible.

In Gephi, open the **Layout** panel (usually on the left sidebar):

1. Select **ForceAtlas 2** from the layout dropdown
2. Set **Scaling** to 10.0 (higher = more spread)
3. Enable **Prevent Overlap**
4. Click **Run** and let it stabilize (watch the graph — when nodes stop moving significantly, click **Stop**)

After layout, run basic statistics. In the **Statistics** panel (right sidebar):

- **Network Diameter** — gives betweenness centrality scores
- **Modularity** — detects communities; set Resolution to 1.0, run it
- **Average Degree** — basic health check

After running Modularity, you get a `modularity_class` attribute on every node.

### Color by community

In the **Appearance** panel:

1. Select **Nodes** → **Color** → **Partition** → choose `modularity_class`
2. Click **Apply**

Each detected community gets a distinct color. This is where the graph starts telling a story: tight clusters of same-color nodes are communities; nodes that sit between clusters and connect to multiple colors are bridges.

### Size by degree

In the same **Appearance** panel:

1. Select **Nodes** → **Size** → **Ranking** → choose `Degree`
2. Set min size 3, max size 30
3. Click **Apply**

High-degree nodes (users or groups with many connections) become visually large. Combined with the betweenness centrality scores from Network Diameter, you can now identify nodes that are large *and* bridge multiple communities — these are the structurally significant accounts.

---

## Stage 6: Connect gephi-ai and Claude

gephi-ai is a two-part system: a Java plugin that runs inside Gephi Desktop and exposes an HTTP API at port 8080, and a Python MCP server that translates Claude's tool calls into HTTP requests to that API.

### Build and install the Java plugin

```bash
git clone https://github.com/MattArtzAnthro/gephi-ai.git
cd gephi-ai/gephi-mcp-plugin
mvn clean package
```

In Gephi: **Tools → Plugins → Downloaded → Add Plugins**, select the `.nbm` file from `target/nbm/gephi-mcp-1.0.0.nbm`. Restart Gephi.

Verify the plugin is active:

```bash
curl http://127.0.0.1:8080/health
```

Expected response: `{"success": true}` or similar. If you get a connection refused, Gephi is not running or the plugin did not install correctly.

### Install the MCP server

```bash
cd gephi-ai/mcp-server
pip install -e .
```

Verify:

```bash
gephi-mcp --help
```

### Connect to Claude Code

The recommended path is installing gephi-ai as a Claude Code plugin:

```bash
claude plugin install gephi-ai/gephi-network-analysis
```

This registers the MCP server, slash commands, and the network analyst agent in your Claude Code installation. Alternatively, add just the MCP tools:

```bash
claude mcp add gephi-mcp -- gephi-mcp
```

### Run the analysis

With Gephi Desktop open and your graph loaded, start a Claude Code session in your project directory. Verify the connection first:

```
> check if gephi is running
```

Claude calls `gephi_health_check` and confirms the connection. Then run the full analysis workflow:

```
> compute modularity and degree centrality on this graph, 
  color nodes by modularity class, size them by degree, 
  run ForceAtlas2 for 1000 iterations, 
  then identify the top 5 nodes by betweenness centrality and tell me 
  which community each one belongs to
```

Claude executes this as a sequence of MCP tool calls — `gephi_compute_modularity`, `gephi_compute_degree`, `gephi_color_by_partition`, `gephi_size_by_ranking`, `gephi_run_layout`, `gephi_compute_betweenness`, `gephi_query_nodes` — and returns a structured summary.

To export:

```
> export the current graph as a PNG at 2400x1800 resolution
```

```
> export the graph as GEXF so I can reimport it later
```

---

## Stage 7: Reading the Output

The graph tells a specific story depending on what you're looking for. Here are the patterns that matter in practice.

**Bridge nodes** are nodes with high betweenness centrality that span multiple modularity classes. In a Telegram network, these are often accounts that are members of many groups simultaneously. They are the connective tissue between communities. In a coordinated influence operation, bridge nodes are often the coordination accounts — they do not post publicly in the target groups but they are present in all of them.

**Amplifier nodes** have high degree but low betweenness and stay within a single community. These are accounts that forward and boost content within their community. They are broadcast infrastructure, not coordination infrastructure.

**Endorsement clusters** — visible in the `ENDORSES` edge layer — show which channels are directing audiences toward each other. A tight cluster of mutual endorsements between 10 channels that are otherwise separate from the rest of the network is a strong signal of coordinated cross-promotion.

**Isolated nodes** (degree 1 or 0 after filtering) are users with no meaningful structural role. They are members by name but not by function. In a large group, the majority of accounts will fall here.

The AI analysis via Claude gives you numbers: modularity score (higher = more distinct communities), the community breakdown, and the top betweenness nodes by name. The graph view gives you the visual. Use both together — a high-betweenness node that is invisible in the graph layout (because ForceAtlas put it at the periphery) is easy to miss without the numerical ranking.

---

## Common Failure Points

**"Verify failed" in the Gephi Neo4j plugin.** Almost always a port number. Use `17687` (desktop stack), not `7687`. Confirm with `docker ps` that `groupint-neo4j` is running.

**Zero nodes after import.** The scrape did not complete. Run the Cypher query above (`MATCH ()-[r]->() RETURN type(r), count(r)`) to check whether edges exist. If the count is 0, re-run the Groupint scrape steps.

**gephi-mcp: command not found.** The MCP server installed into a virtual environment that is not active. Either activate the venv before running Claude Code or install globally with `pip install -e .` outside any venv.

**Claude reports the graph is empty.** Gephi must have an open workspace with a loaded graph at the time Claude queries it. Opening Gephi is not sufficient — you need to have completed the import (Stage 4) in the current session. If you saved a `.gephi` file, open it before running the AI analysis.

**OTP code doesn't arrive.** If the Grizzly SMS number has expired (activation window closed), buy a new number and start a new Groupint session. Do not try to reuse expired numbers for Telegram.

---

## What You Have at the End

A `.gephi` project file containing your graph. A GEXF export that can be opened in any graph tool. A PNG suitable for a report. And Claude's written analysis: community count, modularity score, bridge node list, and a structural summary of what the network looks like.

The pipeline is repeatable. Run it against the same group a week later to detect membership changes. Run it against multiple groups and merge the GEXF files in Gephi to see cross-group overlap. The graph compounds in usefulness the more sources you feed into it.

---

## Resources

| Tool | Link |
|---|---|
| Groupint | github.com/OSINT-for-Ukraine/groupint |
| Grizzly SMS | grizzlysms.com/telegram |
| Telegram API credentials | my.telegram.org/apps |
| Gephi Desktop | gephi.org |
| Gephi Neo4j Plugin | gephi.org/desktop/plugins/neo4j-plugin |
| gephi-ai | github.com/MattArtzAnthro/gephi-ai |

---

*Part 1 of 4 in the AI OSINT Pipeline series.*
