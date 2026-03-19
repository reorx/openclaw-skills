---
name: topic-prompt
description: "Set, update, or manage the /new session prompt for Telegram group topics. Use when the user sends `/topic-prompt` followed by a subcommand or prompt text in a Telegram group topic. Also triggers when user wants to check, change, or clear a topic's session prompt."
---

# Topic Prompt

Manage the prompt injected by the `topic-prompt` hook when `/new` starts a new session in a Telegram group topic.

## Commands

- `/topic-prompt <text>` — set or replace the prompt for the current topic
- `/topic-prompt show` — display the current prompt for this topic
- `/topic-prompt clear` — remove the prompt for this topic

Everything after the subcommand (or after `/topic-prompt` if no subcommand matches) is treated as prompt text.

## Procedure

### Setting a prompt

1. Extract `chat_id` and `topic_id` from the inbound message metadata (session key pattern: `telegram:group:<chatId>:topic:<topicId>`).
2. Build the config key: `telegram:group:<chat_id>:topic:<topic_id>`.
3. Run the set-prompt script:

```bash
./scripts/set-prompt.py "<key>" "<prompt>"
```

4. Confirm to the user with the key and the prompt that was set.

### Showing the current prompt

1. Extract key from session metadata (same as above).
2. Read `~/.openclaw/hooks/topic-prompt/config.json` and look up the key in `topicMap`.
3. If found, display the prompt. If not, tell the user no prompt is configured for this topic and show the key so they can set one.

### Clearing a prompt

1. Extract key from session metadata.
2. Remove the key from `topicMap` in `config.json` and write it back.
3. Confirm removal.

## Error Handling

- If not in a Telegram group topic (missing `chat_id` or `topic_id`), tell the user this command only works in Telegram group topics.
- If no prompt text provided after `/topic-prompt` (and no subcommand), show usage help.
- If the hook is not installed yet, install it first (see below).
- If something goes wrong, check the hook code at `~/.openclaw/hooks/topic-prompt/` to debug — you are allowed to update the code to fix problems.

## Hook Installation

Before setting a prompt, ensure the hook is installed:

1. Check if `~/.openclaw/hooks/topic-prompt/` exists.
2. If not, copy `./hook_template/` to `~/.openclaw/hooks/topic-prompt/`.
3. Verify `config.json` exists inside the hook dir. If missing, create it:

```json
{
  "topicMap": {},
  "suffixPrompt": "Read @AGENTS.md in the project before start doing anything"
}
```

### Config format

- **topicMap** — maps `telegram:group:<chatId>:topic:<topicId>` keys to prompt strings
- **suffixPrompt** — optional text appended to every matched prompt (useful for shared instructions across all topics)
