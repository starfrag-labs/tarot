import type { YamlConfig } from './yaml.schema';

export function overrideWithEnv(config: YamlConfig): YamlConfig {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const eventBusBrokers = process.env.EVENT_BUS_BROKERS;
  const eventBusClientId = process.env.EVENT_BUS_CLIENT_ID;
  const eventBusGroupId = process.env.EVENT_BUS_GROUP_ID;

  if (openaiApiKey) {
    config.openai.apiKey = openaiApiKey;
  }
  if (eventBusBrokers) {
    config.eventBus.client.brokers = eventBusBrokers.split(',');
  }
  if (eventBusClientId) {
    config.eventBus.client.clientId = eventBusClientId;
  }
  if (eventBusGroupId) {
    config.eventBus.consumer.groupId = eventBusGroupId;
  }

  return config;
}
