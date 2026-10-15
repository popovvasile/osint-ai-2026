# AI для OSINT 2026

Course materials for **AI для OSINT 2026**: lessons, homework, prompts, and reference notes for analysts.

**Live site:** [https://osinter.dev](https://osinter.dev)

Content lives in [`content/`](content/). The site is built with [Quartz](https://quartz.jzhao.xyz/) and deployed to GitHub Pages from the `v5` branch via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Local preview

```bash
npm ci
npx quartz build --serve --port 8080
# → http://localhost:8080
```

(Or with Podman: `podman run --rm --network=host --userns=keep-id -v "$PWD:/app:Z" -w /app -e HOME=/tmp -e npm_config_cache=/tmp/.npm node:22 bash -c 'npx quartz build --serve --port 8080'`.)
