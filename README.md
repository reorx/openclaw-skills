# openclaw-skills

Skills for [OpenClaw](https://github.com/reorx/openclaw) — a 24/7 local AI agent accessible via Telegram.

## Available Skills

| Skill | Description |
|---|---|
| [topic-prompt](./topic-prompt/) | Manage per-topic session prompts for Telegram group topics |

## Installation

### Using skm (recommended)

[skm](https://github.com/reorx/skm) is a skill manager that handles cloning, symlinking, and updates for you.

1. Install skm:

```bash
uv tool install skm-cli
```

2. Add this repo to `~/.config/skm/skills.yaml`:

```yaml
packages:
  - repo: https://github.com/reorx/openclaw-skills
    agents:
      includes:
        - openclaw
```

To install only specific skills:

```yaml
packages:
  - repo: https://github.com/reorx/openclaw-skills
    skills:
      - topic-prompt
    agents:
      includes:
        - openclaw
```

3. Run install:

```bash
skm install
```

Or install directly without editing the config:

```bash
skm install https://github.com/reorx/openclaw-skills --agents-includes openclaw
```

### Manual installation

1. Clone this repo:

```bash
git clone https://github.com/reorx/openclaw-skills.git
```

2. Copy (or symlink) the skill directory into OpenClaw's skills directory:

```bash
# Copy
cp -r openclaw-skills/topic-prompt ~/.openclaw/skills/topic-prompt

# Or symlink (changes in the repo are immediately visible)
ln -s "$(pwd)/openclaw-skills/topic-prompt" ~/.openclaw/skills/topic-prompt
```
