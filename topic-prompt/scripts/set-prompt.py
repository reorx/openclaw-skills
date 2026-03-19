#!/usr/bin/env python3
"""Set or update a prompt in the topic-prompt hook's config.json."""

import json
import sys
from pathlib import Path

HOOK_CONFIG = Path.home() / '.openclaw' / 'hooks' / 'topic-prompt' / 'config.json'


def main():
    if len(sys.argv) < 3:
        print(f'Usage: {sys.argv[0]} <key> <prompt>')
        print(f'Example: {sys.argv[0]} "telegram:group:-100123:topic:1" "Your prompt here"')
        sys.exit(1)

    key = sys.argv[1]
    prompt = sys.argv[2]

    if not HOOK_CONFIG.exists():
        print(f'Error: config not found at {HOOK_CONFIG}', file=sys.stderr)
        print('Make sure the topic-prompt hook is installed first.', file=sys.stderr)
        sys.exit(1)

    config = json.loads(HOOK_CONFIG.read_text())
    config.setdefault('topicMap', {})[key] = prompt
    HOOK_CONFIG.write_text(json.dumps(config, indent=2, ensure_ascii=False) + '\n')

    print(f'Set prompt for key: {key}')
    print(f'Prompt: {prompt}')


if __name__ == '__main__':
    main()
