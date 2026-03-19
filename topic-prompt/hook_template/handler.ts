import type { HookHandler } from "../../src/hooks/hooks.js";
import fs from "node:fs/promises";
import { appendFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LOG_FILE = "/tmp/topic-prompt.log";

function log(msg: string) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}\n`;
  try {
    appendFileSync(LOG_FILE, line);
  } catch {
    // ignore write errors
  }
  console.log(`[topic-prompt] ${msg}`);
}

/**
 * Topic Prompt Hook
 *
 * Injects a context prompt when /new is triggered in a Telegram group topic.
 * Reads the prompt from topic-map.json keyed by group chat ID and topic ID.
 */

const handler: HookHandler = async (event) => {
  log(`Hook invoked: type=${event.type} action=${event.action} sessionKey=${event.sessionKey}`);

  if (event.type !== "command" || event.action !== "new") {
    log(`Skipped: not a command:new event`);
    return;
  }

  // Parse session key: agent:main:telegram:group:<chatId>:topic:<topicId>
  const match = event.sessionKey.match(
    /telegram:group:([-\d]+):topic:(\d+)/
  );
  if (!match) {
    log(`Skipped: sessionKey does not match telegram group topic pattern`);
    return; // Not a telegram group topic session
  }

  const [, chatId, topicId] = match;
  const key = `telegram:group:${chatId}:topic:${topicId}`;
  log(`Parsed key: ${key}`);

  try {
    const hookDir = path.dirname(fileURLToPath(import.meta.url));
    const configFile = path.join(hookDir, "config.json");
    log(`Reading config: ${configFile}`);
    const raw = await fs.readFile(configFile, "utf-8");
    const config: {
      topicMap: Record<string, string>;
      suffixPrompt?: string;
    } = JSON.parse(raw);

    const topicMapKeys = Object.keys(config.topicMap);
    log(`Config loaded: ${topicMapKeys.length} entries in topicMap: [${topicMapKeys.join(", ")}]`);

    const prompt = config.topicMap[key];
    if (!prompt) {
      log(`No prompt configured for key: ${key}`);
      event.messages.push(`⚠️ No prompt configured for key: ${key}`);
      log(`Pushed fallback message to event.messages (length=${event.messages.length})`);
      return;
    }

    const suffix = config.suffixPrompt?.trim();
    const fullPrompt = suffix ? `${prompt}\n\n${suffix}` : prompt;
    event.messages.push(fullPrompt);
    log(`Injected prompt for ${key} (prompt length=${fullPrompt.length}, messages count=${event.messages.length})`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    log(`ERROR: ${errMsg}`);
    console.error(`[topic-prompt] Failed:`, errMsg);
  }
};

export default handler;
