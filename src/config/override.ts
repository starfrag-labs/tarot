import type { YamlConfig } from './yaml.schema';

export function overrideWithEnv(config: YamlConfig): YamlConfig {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (openaiApiKey) {
    config.openai.apiKey = openaiApiKey;
  }

  return config;
}
