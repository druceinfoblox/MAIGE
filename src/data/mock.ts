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

// ── GPT Compliance (Change 2) ──

export type GptComplianceItem = {
  id: string;
  name: string;
  publisher: string;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Under Review';
  users: number;
  lastAssessed: string;
};

export const gptComplianceItems: GptComplianceItem[] = [
  { id: 'gpt-1', name: 'Zapier AI Actions', publisher: 'Zapier', category: 'Automation', riskLevel: 'Medium', complianceStatus: 'Compliant', users: 34, lastAssessed: '2025-03-15' },
  { id: 'gpt-2', name: 'Slack GPT', publisher: 'Salesforce', category: 'Productivity', riskLevel: 'Low', complianceStatus: 'Compliant', users: 89, lastAssessed: '2025-03-20' },
  { id: 'gpt-3', name: 'GitHub Copilot Chat', publisher: 'Microsoft', category: 'Code Assistant', riskLevel: 'Medium', complianceStatus: 'Compliant', users: 63, lastAssessed: '2025-03-21' },
  { id: 'gpt-4', name: 'Notion AI', publisher: 'Notion', category: 'Productivity', riskLevel: 'Low', complianceStatus: 'Under Review', users: 27, lastAssessed: '2025-03-18' },
  { id: 'gpt-5', name: 'Salesforce Einstein', publisher: 'Salesforce', category: 'CRM', riskLevel: 'High', complianceStatus: 'Non-Compliant', users: 12, lastAssessed: '2025-03-10' },
  { id: 'gpt-6', name: 'HubSpot AI', publisher: 'HubSpot', category: 'Marketing', riskLevel: 'Medium', complianceStatus: 'Compliant', users: 18, lastAssessed: '2025-03-19' },
  { id: 'gpt-7', name: 'Jira Atlassian Intelligence', publisher: 'Atlassian', category: 'Project Mgmt', riskLevel: 'Low', complianceStatus: 'Compliant', users: 44, lastAssessed: '2025-03-21' },
  { id: 'gpt-8', name: 'Custom Internal GPT', publisher: 'Internal', category: 'Internal', riskLevel: 'Critical', complianceStatus: 'Non-Compliant', users: 8, lastAssessed: '2025-03-05' },
];

// ── Attack Surface (Change 3, Tab 2) ──

export type AttackSurfaceItem = {
  id: string;
  asset: string;
  registry: string;
  type: 'Impersonation' | 'Exact Match' | 'Typosquat';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'ACTIVE' | 'REPORTED';
  detected: string;
};

export const attackSurfaceItems: AttackSurfaceItem[] = [
  { id: 'as-1', asset: 'company-ai.com', registry: 'Domain Registrar', type: 'Typosquat', severity: 'High', status: 'ACTIVE', detected: '2025-03-15' },
  { id: 'as-2', asset: 'CompanyAI Assistant', registry: 'OpenAI GPT Store', type: 'Impersonation', severity: 'Critical', status: 'ACTIVE', detected: '2025-03-18' },
  { id: 'as-3', asset: 'Company Bot (unofficial)', registry: 'Slack App Directory', type: 'Impersonation', severity: 'High', status: 'REPORTED', detected: '2025-03-10' },
  { id: 'as-4', asset: 'company-mcp-tools', registry: 'MCP Hub', type: 'Exact Match', severity: 'Critical', status: 'ACTIVE', detected: '2025-03-20' },
  { id: 'as-5', asset: 'CompanyGPT', registry: 'Microsoft Copilot Store', type: 'Impersonation', severity: 'High', status: 'ACTIVE', detected: '2025-03-19' },
  { id: 'as-6', asset: 'company.ai', registry: 'Domain Registrar', type: 'Typosquat', severity: 'Medium', status: 'REPORTED', detected: '2025-03-08' },
  { id: 'as-7', asset: 'Company AI Tools', registry: 'Hugging Face', type: 'Impersonation', severity: 'Medium', status: 'REPORTED', detected: '2025-03-12' },
  { id: 'as-8', asset: 'CompanyAssist', registry: 'Google Workspace Marketplace', type: 'Impersonation', severity: 'High', status: 'ACTIVE', detected: '2025-03-17' },
];

// ── Digital Risk (Change 3, Tab 3) ──

export type DigitalRiskItem = {
  id: string;
  finding: string;
  source: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  detected: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
};

export const digitalRiskItems: DigitalRiskItem[] = [
  { id: 'dr-1', finding: 'API key exposed in public GitHub repo', source: 'GitHub', risk: 'Critical', detected: '2025-03-21', status: 'OPEN' },
  { id: 'dr-2', finding: 'LLM system prompt leaked via Hugging Face dataset', source: 'Hugging Face', risk: 'High', detected: '2025-03-20', status: 'INVESTIGATING' },
  { id: 'dr-3', finding: 'Rogue agent impersonating internal HR bot', source: 'Telegram', risk: 'High', detected: '2025-03-19', status: 'OPEN' },
  { id: 'dr-4', finding: 'Employee credentials in AI training dataset', source: 'GitHub', risk: 'Critical', detected: '2025-03-18', status: 'INVESTIGATING' },
  { id: 'dr-5', finding: 'Internal architecture docs in public model card', source: 'Hugging Face', risk: 'Medium', detected: '2025-03-15', status: 'OPEN' },
  { id: 'dr-6', finding: 'Unauthorized GPT using company branding', source: 'OpenAI GPT Store', risk: 'High', detected: '2025-03-14', status: 'OPEN' },
  { id: 'dr-7', finding: 'Source code snippet in LLM benchmark', source: 'Papers with Code', risk: 'Medium', detected: '2025-03-10', status: 'RESOLVED' },
  { id: 'dr-8', finding: 'Customer PII in fine-tuning dataset', source: 'GitHub', risk: 'Critical', detected: '2025-03-08', status: 'INVESTIGATING' },
];

// ── Inspection Policies (Change 4) ──

export type InspectionPolicy = {
  id: string;
  name: string;
  type: 'TOOL' | 'USER';
  findings: number;
  created: string;
  lastFinding: string;
  status: 'enabled';
};

export const inspectionPolicies: InspectionPolicy[] = [
  { id: 'ip-1', name: 'PII Detection — Customer Data', type: 'TOOL', findings: 3, created: '2025-01-10', lastFinding: '2025-03-21', status: 'enabled' },
  { id: 'ip-2', name: 'Source Code Exfiltration Monitor', type: 'USER', findings: 2, created: '2025-02-01', lastFinding: '2025-03-20', status: 'enabled' },
  { id: 'ip-3', name: 'Credential & API Key Leak Detection', type: 'TOOL', findings: 2, created: '2025-01-15', lastFinding: '2025-03-19', status: 'enabled' },
  { id: 'ip-4', name: 'Internal Architecture Disclosure', type: 'USER', findings: 2, created: '2025-02-20', lastFinding: '2025-03-18', status: 'enabled' },
  { id: 'ip-5', name: 'Customer PII in Code Prompts', type: 'TOOL', findings: 1, created: '2025-03-01', lastFinding: '2025-03-15', status: 'enabled' },
];

// ── Governance Rules (Change 5, Tab 1) ──

export type GovernanceRule = {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Draft';
  violations: number;
  updated: string;
};

export const governanceRules: GovernanceRule[] = [
  { id: 'gr-1', name: 'Block Unsanctioned LLMs', description: 'Prevent access to non-approved AI providers', category: 'Access Control', severity: 'High', status: 'Active', violations: 23, updated: '2025-03-20' },
  { id: 'gr-2', name: 'Require TLS for AI Endpoints', description: 'All AI service connections must use TLS 1.2+', category: 'Network Security', severity: 'Medium', status: 'Active', violations: 8, updated: '2025-03-18' },
  { id: 'gr-3', name: 'PII Detection in Prompts', description: 'Flag and block prompts containing personal data', category: 'Data Protection', severity: 'Critical', status: 'Active', violations: 12, updated: '2025-03-21' },
  { id: 'gr-4', name: 'Rate Limit per User', description: 'Max 1000 AI requests per user per day', category: 'Usage Control', severity: 'Low', status: 'Active', violations: 4, updated: '2025-03-15' },
  { id: 'gr-5', name: 'MCP Endpoint Blocking', description: 'Block all external MCP server connections', category: 'Access Control', severity: 'High', status: 'Active', violations: 7, updated: '2025-03-19' },
  { id: 'gr-6', name: 'Copilot Code Review', description: 'Require human review for AI-generated code in prod', category: 'Compliance', severity: 'Medium', status: 'Draft', violations: 0, updated: '2025-03-10' },
  { id: 'gr-7', name: 'AI Audit Logging', description: 'Log all AI interactions for compliance audit', category: 'Compliance', severity: 'Low', status: 'Active', violations: 0, updated: '2025-03-01' },
];

// ── Compliance Frameworks (Change 5, Tab 2) ──

export type ComplianceFramework = {
  id: string;
  name: string;
  coverage: number;
  passing: number;
  failing: number;
  controls: number;
  status: 'Compliant' | 'Partial' | 'Non-Compliant';
};

export const complianceFrameworks: ComplianceFramework[] = [
  { id: 'cf-1', name: 'SOC 2 Type II', coverage: 78, passing: 18, failing: 5, controls: 23, status: 'Partial' },
  { id: 'cf-2', name: 'GDPR Article 22', coverage: 65, passing: 13, failing: 7, controls: 20, status: 'Partial' },
  { id: 'cf-3', name: 'NIST AI RMF', coverage: 82, passing: 41, failing: 9, controls: 50, status: 'Compliant' },
  { id: 'cf-4', name: 'ISO 42001', coverage: 45, passing: 9, failing: 11, controls: 20, status: 'Non-Compliant' },
];

// ── AI Usage Policies (Change 5, Tab 3) ──

export type AIUsagePolicy = {
  id: string;
  toolPattern: string;
  action: 'Allow' | 'Block' | 'Monitor' | 'Review';
  scope: string;
  enforced: boolean;
  createdBy: string;
  created: string;
};

export const aiUsagePolicies: AIUsagePolicy[] = [
  { id: 'aup-1', toolPattern: 'api.openai.com/*', action: 'Allow', scope: 'All Users', enforced: true, createdBy: 'admin@company.com', created: '2025-01-15' },
  { id: 'aup-2', toolPattern: '*.huggingface.co/*', action: 'Monitor', scope: 'Engineering', enforced: true, createdBy: 'security@company.com', created: '2025-02-01' },
  { id: 'aup-3', toolPattern: 'api.replicate.com/*', action: 'Block', scope: 'All Users', enforced: true, createdBy: 'admin@company.com', created: '2025-02-15' },
  { id: 'aup-4', toolPattern: 'cursor.sh/*', action: 'Review', scope: 'Engineering', enforced: false, createdBy: 'security@company.com', created: '2025-03-01' },
  { id: 'aup-5', toolPattern: '*.anthropic.com/*', action: 'Allow', scope: 'All Users', enforced: true, createdBy: 'admin@company.com', created: '2025-01-20' },
  { id: 'aup-6', toolPattern: 'Unknown AI Services', action: 'Block', scope: 'All Users', enforced: true, createdBy: 'admin@company.com', created: '2025-03-10' },
];
