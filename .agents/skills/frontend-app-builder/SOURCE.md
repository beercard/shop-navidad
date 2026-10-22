# Skill source and compatibility

- Skill: `frontend-app-builder` (OpenAI Build Web Apps plugin, v0.1.2)
- Official source: https://github.com/openai/plugins/tree/main/plugins/build-web-apps/skills/frontend-app-builder
- Instructions: https://github.com/openai/plugins/blob/main/plugins/build-web-apps/skills/frontend-app-builder/SKILL.md
- License: MIT, as declared by the official plugin manifest (`plugins/build-web-apps/.codex-plugin/plugin.json`). The upstream skill folder does not contain a separate license file.
- Runtime/dependency requirements: no install or setup scripts, package dependencies, or project runtime dependencies are declared by this skill. Its workflow expects image generation and a browser/IAB for visual work, with Playwright as a documented fallback.
- Codex format: Agent Skills folder containing `SKILL.md`, with optional `references/` and `agents/` resources.
