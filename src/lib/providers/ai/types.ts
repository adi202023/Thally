// Thally — Knowledge Engine Type Definitions
// All AI/analysis operations go through this interface.

export interface ProductChangeInput {
  id: string;
  title: string;
  description?: string;
  changeType: string;
  commitMessage: string;
  diff?: string;
  changedFiles: string[];
  additions: number;
  deletions: number;
}

export interface KnowledgeAreaInput {
  id: string;
  slug: string;
  title: string;
  description?: string;
  existingContent?: string;
}

export interface KnowledgeEngineInput {
  productChange: ProductChangeInput;
  knowledgeAreas: KnowledgeAreaInput[];
}

export interface AffectedAreaResult {
  knowledgeAreaId: string;
  affectedStatus: 'definitely' | 'possibly' | 'unaffected';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  recommendedChanges: string[];
}

export interface KnowledgeEngineResult {
  mode: 'demo' | 'connected';
  modelName?: string;
  affectedAreas: AffectedAreaResult[];
  changeSummary: string;
  userImpact: string;
  risks: string[];
  recommendedActions: string[];
  overallConfidence: 'high' | 'medium' | 'low';
  analysisLatencyMs: number;
}

export interface DocumentationProposalInput {
  changeTitle: string;
  changeSummary: string;
  userImpact: string;
  currentContent: string;
  evidenceSummary: string;
  pageTitle: string;
  pageSlug: string;
}

export interface DocumentationProposalResult {
  proposedContent: string;
  changeSummary: string;
  mode: 'demo' | 'connected';
}

export interface AgentQueryInput {
  query: string;
  chunks: Array<{ pageSlug: string; pageTitle: string; content: string }>;
}

export interface AgentQueryResult {
  answer: string;
  citations: Array<{ pageSlug: string; pageTitle: string; excerpt: string }>;
  mode: 'demo' | 'connected';
  hasAnswer: boolean;
}

/**
 * Abstract knowledge engine interface.
 * Implement with OpenAI, Anthropic, or any other LLM provider.
 */
export interface KnowledgeEngine {
  analyzeChange(input: KnowledgeEngineInput): Promise<KnowledgeEngineResult>;
  generateProposal(input: DocumentationProposalInput): Promise<DocumentationProposalResult>;
  queryKnowledge(input: AgentQueryInput): Promise<AgentQueryResult>;
}
