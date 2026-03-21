export type AITool = {
  id: string;
  name: string;
  domain: string;
  category: string;
  status: 'approved' | 'unknown' | 'unsanctioned';
  users: number;
  requests: number;
  firstSeen: string;
  lastSeen: string;
};

export type UserActivity = {
  id: string;
  email: string;
  department: string;
  toolsUsed: string[];
  totalRequests: number;
  lastActive: string;
  riskLevel: 'low' | 'medium' | 'high';
};

export type InternalAgent = {
  id: string;
  hostname: string;
  serviceType: 'agent' | 'api' | 'unknown';
  protocol: string;
  clients: number;
  queriesPerDay: number;
  firstSeen: string;
  confidence: 'confirmed' | 'inferred';
};

export type ExternalExposure = {
  id: string;
  domain: string;
  endpoint: string;
  type: 'mcp' | 'api' | 'llm-proxy' | 'unknown';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  lastProbed: string;
  responseCode: number;
  tlsValid: boolean;
};

export const aiTools: AITool[] = [
  { id: '1', name: 'ChatGPT', domain: 'api.openai.com', category: 'LLM', status: 'approved', users: 142, requests: 28473, firstSeen: '2024-11-02', lastSeen: '2025-03-21' },
  { id: '2', name: 'Claude', domain: 'api.anthropic.com', category: 'LLM', status: 'approved', users: 87, requests: 14291, firstSeen: '2024-12-15', lastSeen: '2025-03-21' },
  { id: '3', name: 'GitHub Copilot', domain: 'copilot-proxy.githubusercontent.com', category: 'Code Assistant', status: 'approved', users: 63, requests: 91204, firstSeen: '2024-09-10', lastSeen: '2025-03-21' },
  { id: '4', name: 'Midjourney', domain: 'cdn.midjourney.com', category: 'Image Gen', status: 'unknown', users: 12, requests: 847, firstSeen: '2025-02-08', lastSeen: '2025-03-19' },
  { id: '5', name: 'Gemini', domain: 'generativelanguage.googleapis.com', category: 'LLM', status: 'approved', users: 34, requests: 5629, firstSeen: '2025-01-03', lastSeen: '2025-03-20' },
  { id: '6', name: 'Perplexity', domain: 'api.perplexity.ai', category: 'Search', status: 'unknown', users: 8, requests: 312, firstSeen: '2025-03-01', lastSeen: '2025-03-18' },
  { id: '7', name: 'Cursor AI', domain: 'api2.cursor.sh', category: 'Code Assistant', status: 'unsanctioned', users: 19, requests: 4520, firstSeen: '2025-01-20', lastSeen: '2025-03-21' },
  { id: '8', name: 'Hugging Face', domain: 'api-inference.huggingface.co', category: 'ML Platform', status: 'unknown', users: 5, requests: 1893, firstSeen: '2025-02-14', lastSeen: '2025-03-17' },
  { id: '9', name: 'Replicate', domain: 'api.replicate.com', category: 'ML Platform', status: 'unsanctioned', users: 3, requests: 241, firstSeen: '2025-03-10', lastSeen: '2025-03-20' },
  { id: '10', name: 'Mistral', domain: 'api.mistral.ai', category: 'LLM', status: 'unknown', users: 7, requests: 1102, firstSeen: '2025-02-22', lastSeen: '2025-03-21' },
];

export const userActivities: UserActivity[] = [
  { id: '1', email: 'steven.park@company.com', department: 'Engineering', toolsUsed: ['ChatGPT', 'Claude', 'GitHub Copilot'], totalRequests: 4892, lastActive: '2025-03-21', riskLevel: 'low' },
  { id: '2', email: 'maria.chen@company.com', department: 'Engineering', toolsUsed: ['ChatGPT', 'Cursor AI', 'GitHub Copilot'], totalRequests: 3241, lastActive: '2025-03-21', riskLevel: 'medium' },
  { id: '3', email: 'james.wilson@company.com', department: 'Product', toolsUsed: ['ChatGPT', 'Midjourney', 'Perplexity'], totalRequests: 1847, lastActive: '2025-03-20', riskLevel: 'medium' },
  { id: '4', email: 'aisha.rahman@company.com', department: 'Data Science', toolsUsed: ['Claude', 'Hugging Face', 'Replicate'], totalRequests: 6103, lastActive: '2025-03-21', riskLevel: 'high' },
  { id: '5', email: 'tom.baker@company.com', department: 'Marketing', toolsUsed: ['ChatGPT', 'Midjourney'], totalRequests: 892, lastActive: '2025-03-19', riskLevel: 'low' },
  { id: '6', email: 'priya.sharma@company.com', department: 'Engineering', toolsUsed: ['Claude', 'Gemini', 'Mistral'], totalRequests: 2748, lastActive: '2025-03-21', riskLevel: 'medium' },
  { id: '7', email: 'lucas.dubois@company.com', department: 'Security', toolsUsed: ['ChatGPT'], totalRequests: 328, lastActive: '2025-03-18', riskLevel: 'low' },
  { id: '8', email: 'nina.volkov@company.com', department: 'Engineering', toolsUsed: ['GitHub Copilot', 'Cursor AI', 'ChatGPT', 'Claude'], totalRequests: 8412, lastActive: '2025-03-21', riskLevel: 'medium' },
];

export const internalAgents: InternalAgent[] = [
  { id: '1', hostname: 'mcp.internal.company.com', serviceType: 'agent', protocol: 'HTTPS/gRPC', clients: 14, queriesPerDay: 2340, firstSeen: '2025-01-15', confidence: 'confirmed' },
  { id: '2', hostname: 'llm-gateway.corp.company.com', serviceType: 'api', protocol: 'HTTPS', clients: 42, queriesPerDay: 8920, firstSeen: '2024-11-20', confidence: 'confirmed' },
  { id: '3', hostname: 'ai-proxy.staging.company.com', serviceType: 'api', protocol: 'HTTPS', clients: 7, queriesPerDay: 1230, firstSeen: '2025-02-01', confidence: 'inferred' },
  { id: '4', hostname: 'agent-orchestrator.k8s.company.com', serviceType: 'agent', protocol: 'gRPC', clients: 3, queriesPerDay: 450, firstSeen: '2025-03-05', confidence: 'inferred' },
  { id: '5', hostname: 'embeddings.ml.company.com', serviceType: 'api', protocol: 'HTTPS', clients: 21, queriesPerDay: 15200, firstSeen: '2024-10-08', confidence: 'confirmed' },
  { id: '6', hostname: 'rag-service.internal.company.com', serviceType: 'agent', protocol: 'HTTPS', clients: 9, queriesPerDay: 3100, firstSeen: '2025-01-28', confidence: 'inferred' },
];

export const externalExposures: ExternalExposure[] = [
  { id: '1', domain: 'mcp.company.com', endpoint: '/.well-known/mcp', type: 'mcp', riskLevel: 'critical', lastProbed: '2025-03-21', responseCode: 200, tlsValid: true },
  { id: '2', domain: 'api.company.com', endpoint: '/v1/chat/completions', type: 'llm-proxy', riskLevel: 'high', lastProbed: '2025-03-21', responseCode: 200, tlsValid: true },
  { id: '3', domain: 'agent.company.com', endpoint: '/agent/invoke', type: 'api', riskLevel: 'high', lastProbed: '2025-03-20', responseCode: 401, tlsValid: true },
  { id: '4', domain: 'dev-ai.company.com', endpoint: '/api/generate', type: 'api', riskLevel: 'medium', lastProbed: '2025-03-19', responseCode: 403, tlsValid: false },
  { id: '5', domain: 'ml-staging.company.com', endpoint: '/predict', type: 'unknown', riskLevel: 'medium', lastProbed: '2025-03-18', responseCode: 200, tlsValid: true },
];

export const trendData = [
  { date: 'Jan', requests: 42000, tools: 5, users: 89 },
  { date: 'Feb', requests: 68000, tools: 7, users: 124 },
  { date: 'Mar', requests: 148000, tools: 10, users: 187 },
];

export const summaryMetrics = {
  totalTools: 10,
  totalUsers: 187,
  internalAgents: 6,
  externalExposures: 5,
  unsanctionedTools: 2,
  unknownTools: 4,
  criticalExposures: 1,
  shadowAIUsers: 31,
};
