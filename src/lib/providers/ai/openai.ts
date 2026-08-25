// Thally — OpenAI Knowledge Engine (Stub)
// Set AI_PROVIDER=openai and OPENAI_API_KEY to enable.

import type { KnowledgeEngine, KnowledgeEngineInput, KnowledgeEngineResult, DocumentationProposalInput, DocumentationProposalResult, AgentQueryInput, AgentQueryResult } from './types';

export class OpenAIKnowledgeEngine implements KnowledgeEngine {
  constructor(private apiKey: string, private model: string = 'gpt-4o') {}

  async analyzeChange(_input: KnowledgeEngineInput): Promise<KnowledgeEngineResult> {
    throw new Error('OpenAIKnowledgeEngine not yet implemented. Set AI_PROVIDER=openai and OPENAI_API_KEY.');
  }

  async generateProposal(_input: DocumentationProposalInput): Promise<DocumentationProposalResult> {
    throw new Error('Not implemented');
  }

  async queryKnowledge(_input: AgentQueryInput): Promise<AgentQueryResult> {
    throw new Error('Not implemented');
  }
}
