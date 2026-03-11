import { configSchema } from './config.schema';
import type { Config } from './config.schema';
import { loadYamlConfig } from './load';
import { overrideWithEnv } from './override';

export function validate(): Config {
  const yamlConfig = loadYamlConfig();
  const overriddenConfig = overrideWithEnv(yamlConfig);
  return configSchema.parse(overriddenConfig);
}
