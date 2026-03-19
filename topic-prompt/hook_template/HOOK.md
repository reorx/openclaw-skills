---
name: topic-prompt
description: "Inject a context prompt when /new is triggered in a Telegram group topic, based on a configurable map"
metadata: { "openclaw": { "emoji": "📌", "events": ["command:new"] } }
---

# Topic Prompt

Injects a predefined context prompt when `/new` is issued in a Telegram group topic.

## How It Works

1. On `/new`, parses the session key to extract group chat ID and topic ID
2. Looks up a prompt from `topic-map.json` (same directory as this hook)
3. Pushes the prompt as a message to the new session

## Configuration

Edit `config.json` in this hook's directory:

```json
{
  "topicMap": {
    "telegram:group:-1003705332435:topic:5": "Topic-specific prompt...",
    "telegram:group:-1003705332435:topic:72": "Another topic prompt..."
  },
  "suffixPrompt": "Optional text appended to every matched topic prompt."
}
```

- **topicMap**: key format `telegram:group:<chatId>:topic:<topicId>` → prompt string
- **suffixPrompt**: appended to every matched prompt (useful for shared instructions across all topics)

When a topic has no matching key, the hook logs:
`⚠️ No prompt configured for key: telegram:group:<chatId>:topic:<topicId>`
— copy that key directly into `config.json`'s `topicMap` to add a new entry.
