// Thally — Provider Factory
// Returns the correct provider implementation based on config.

import { config } from '@/lib/config';
import { MockRepositoryProvider } from './repository/mock';
import { GitHubRepositoryProvider } from './repository/github';
import { DemoKnowledgeEngine } from './ai/demo';
import { OpenAIKnowledgeEngine } from './ai/openai';
import type { RepositoryProvider } from './repository/types';
import type { KnowledgeEngine } from './ai/types';

export function getRepositoryProvider(options: { owner: string; repo: string }): RepositoryProvider {
  if (config.demo.enabled || !config.github.token) {
    return new MockRepositoryProvider(options);
  }
  return new GitHubRepositoryProvider({ ...options, token: config.github.token });
}

export function getKnowledgeEngine(): KnowledgeEngine {
  if (config.demo.enabled || config.ai.provider === 'demo' || !config.ai.openaiApiKey) {
    return new DemoKnowledgeEngine();
  }
  if (config.ai.provider === 'openai' && config.ai.openaiApiKey) {
    return new OpenAIKnowledgeEngine(config.ai.openaiApiKey, config.ai.model);
  }
  return new DemoKnowledgeEngine();
}
