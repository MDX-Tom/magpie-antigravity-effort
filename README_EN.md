<h1 align="center">⚡ Magpie Antigravity Effort</h1>

<p align="center">
  Dynamically override reasoning effort / thinking levels for Antigravity & Gemini models at the Magpie gateway layer.
</p>

<p align="center">
  <a href="https://usemagpie.ai/"><img alt="Magpie Middleware" src="https://img.shields.io/badge/Magpie-Gateway_Middleware-111827?style=flat-square" /></a>
  <a href="https://github.com/yetone/magpie/issues/4838"><img alt="Issue Fix" src="https://img.shields.io/badge/Fix-Issue_%234838-008080?style=flat-square" /></a>
  <a href="https://nodejs.org/"><img alt="Node / Bun" src="https://img.shields.io/badge/Runtime-moejs%20%2F%20Bun-3776AB?style=flat-square" /></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" /></a>
</p>

<p align="center">
  <a href="README.md">简体中文</a> · <strong>English</strong>
</p>

> [!IMPORTANT]
> **This plugin resolves the issue where Antigravity as an agent cannot adjust reasoning effort in the current version of Magpie (tracked in Magpie Issue [#4838](https://github.com/yetone/magpie/issues/4838)).**
> 
> Because Antigravity is marked with `NoNames: true` in Magpie, UI-level model name mapping and effort overrides are ignored by Antigravity, defaulting to `low` thinking effort (~1000 tokens). This gateway middleware intercepts incoming requests and injects the user-selected reasoning effort (`low`, `medium`, or `high`) directly before routing.

---

## Why It Is Needed

| Comparison | Stock Magpie + Antigravity | With magpie-antigravity-effort |
| --- | --- | --- |
| **Problem** | Antigravity model names are hardcoded; Magpie UI effort settings do not take effect, sticking at `low` | Bypasses hardcoded restrictions and enables full control over reasoning effort |
| **Method** | Await upstream refactoring in Magpie core | Injects standard reasoning and thinking parameters via ultra-fast moejs runtime (< 1 µs) |
| **Outcome** | Shallow thinking budget (~1k tokens), suboptimal for complex tasks | Full `high` thinking capability (1.0 effort), customizable via Magpie GUI |
| **Performance Overhead** | None | Under 1 microsecond per request, zero network latency |
| **Control** | No GUI adjustment possible | Configurable via Magpie plugin settings panel or CLI |

---

## Installation

### Method 1: Magpie Desktop GUI (Recommended)

1. Open **Magpie Desktop**, go to **Plugins** in the sidebar.
2. Select **Discover → Unofficial Plugins · GitHub**.
3. Search for `magpie-antigravity-effort`, click **Add** and enable it.

### Method 2: Magpie CLI

```bash
magpie plugin add github:midaxia/magpie-antigravity-effort
```

### Method 3: Local Development Folder

```bash
git clone https://github.com/midaxia/magpie-antigravity-effort.git
magpie plugin add ./magpie-antigravity-effort
```

---

## Configuration Options

Configure options directly in the Magpie UI under **Plugins → Installed → Antigravity Effort Gating → Options**:

```json
{
  "enabled": true,
  "effort": "high",
  "applyTo": ["gemini", "flash", "antigravity"]
}
```

Or via CLI:

```bash
# Set reasoning effort to high
magpie plugin options magpie-antigravity-effort '{"effort": "high"}'

# Set reasoning effort to medium
magpie plugin options magpie-antigravity-effort '{"effort": "medium"}'

# Disable override temporarily
magpie plugin options magpie-antigravity-effort '{"effort": "off"}'

# Reset to defaults
magpie plugin options magpie-antigravity-effort off
```

---

## License

[MIT](LICENSE)
