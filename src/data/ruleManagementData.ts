export type RuleStatus = "SANDBOX" | "ACTIVE" | "INACTIVE";
export type RuleCategory = "Velocity" | "Geography" | "MCC" | "Amount" | "Device" | "Network" | "Behavior";

export interface RuleLibraryItem {
  id: string;
  name: string;
  category: RuleCategory;
  status: RuleStatus;
  hits: number;
  blocks: number;
  falsePositiveRate: number;
  lastModified: string;
  channels: string[];
  description: string;
}

export interface RuleTemplate {
  id: string;
  name: string;
  category: RuleCategory;
  description: string;
  supportedChannels: string[];
  previewLogic: string;
  usageCount: number;
}

export interface SimulationResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  action: "BLOCK" | "ALERT" | "CASE" | "PASS";
  score: number;
  reason: string;
}

export interface DeploymentRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  version: string;
  stage: "SANDBOX" | "STAGING" | "PRODUCTION";
  status: "PENDING" | "APPROVED" | "DEPLOYED" | "ROLLED_BACK";
  approvedBy?: string;
  deployedAt?: string;
  notes?: string;
}

// Rule Library Mock Data
export const ruleLibraryItems: RuleLibraryItem[] = [
  {
    id: "RULE-001",
    name: "High Risk Country",
    category: "Geography",
    status: "ACTIVE",
    hits: 1245,
    blocks: 312,
    falsePositiveRate: 3.2,
    lastModified: "2026-01-15 10:30",
    channels: ["Online", "Mobile"],
    description: "Blocks transactions from high-risk countries with elevated fraud patterns"
  },
  {
    id: "RULE-002",
    name: "Unusual Amount",
    category: "Amount",
    status: "ACTIVE",
    hits: 2156,
    blocks: 245,
    falsePositiveRate: 12.5,
    lastModified: "2026-01-22 14:15",
    channels: ["Online", "POS", "Mobile"],
    description: "Flags transactions that deviate significantly from user's spending pattern"
  },
  {
    id: "RULE-003",
    name: "Velocity Check",
    category: "Velocity",
    status: "ACTIVE",
    hits: 987,
    blocks: 198,
    falsePositiveRate: 4.8,
    lastModified: "2026-02-01 09:45",
    channels: ["Online", "Mobile"],
    description: "Detects abnormal transaction velocity within short timeframes"
  },
  {
    id: "RULE-004",
    name: "Blacklisted MCC",
    category: "MCC",
    status: "ACTIVE",
    hits: 756,
    blocks: 156,
    falsePositiveRate: 2.1,
    lastModified: "2025-12-10 16:20",
    channels: ["Online", "POS"],
    description: "Blocks transactions at merchant categories with high fraud rates"
  },
  {
    id: "RULE-005",
    name: "Unusual Location",
    category: "Geography",
    status: "ACTIVE",
    hits: 1543,
    blocks: 124,
    falsePositiveRate: 15.3,
    lastModified: "2026-01-28 11:10",
    channels: ["Online", "Mobile", "ATM"],
    description: "Alerts on transactions from unexpected geographic locations"
  },
  {
    id: "RULE-006",
    name: "New Device",
    category: "Device",
    status: "ACTIVE",
    hits: 2345,
    blocks: 89,
    falsePositiveRate: 8.7,
    lastModified: "2026-02-05 08:35",
    channels: ["Online", "Mobile"],
    description: "Monitors transactions from previously unseen devices"
  },
  {
    id: "RULE-007",
    name: "Large Transaction",
    category: "Amount",
    status: "ACTIVE",
    hits: 432,
    blocks: 267,
    falsePositiveRate: 1.5,
    lastModified: "2025-11-18 13:50",
    channels: ["Online", "POS"],
    description: "Blocks unusually large transaction amounts above threshold"
  },
  {
    id: "RULE-008",
    name: "VPN Detection",
    category: "Network",
    status: "ACTIVE",
    hits: 1876,
    blocks: 445,
    falsePositiveRate: 6.2,
    lastModified: "2026-02-03 15:25",
    channels: ["Online"],
    description: "Identifies and blocks transactions routed through VPN services"
  },
  {
    id: "RULE-009",
    name: "Multiple Failed Attempts",
    category: "Behavior",
    status: "ACTIVE",
    hits: 654,
    blocks: 512,
    falsePositiveRate: 0.8,
    lastModified: "2025-12-22 10:05",
    channels: ["Online", "POS", "Mobile", "ATM"],
    description: "Blocks cards with repeated failed authorization attempts"
  },
  {
    id: "RULE-010",
    name: "First International",
    category: "Geography",
    status: "SANDBOX",
    hits: 234,
    blocks: 45,
    falsePositiveRate: 18.9,
    lastModified: "2026-02-08 12:30",
    channels: ["Online", "POS"],
    description: "Creates case for review on first international transactions"
  },
  {
    id: "RULE-011",
    name: "Weekend High Amount",
    category: "Amount",
    status: "SANDBOX",
    hits: 112,
    blocks: 28,
    falsePositiveRate: 22.1,
    lastModified: "2026-02-09 07:15",
    channels: ["Online"],
    description: "Flags high-value transactions occurring on weekends"
  },
  {
    id: "RULE-012",
    name: "Dormant Card Usage",
    category: "Behavior",
    status: "INACTIVE",
    hits: 0,
    blocks: 0,
    falsePositiveRate: 0,
    lastModified: "2025-10-05 14:40",
    channels: ["Online", "POS", "Mobile"],
    description: "Alerts when dormant cards (>90 days) are used"
  }
];

// Rule Templates Mock Data
export const ruleTemplates: RuleTemplate[] = [
  {
    id: "TMPL-001",
    name: "Transaction Velocity",
    category: "Velocity",
    description: "Detect multiple transactions within a short time window",
    supportedChannels: ["Online", "Mobile", "POS"],
    previewLogic: "IF transaction_count > X within Y minutes THEN action",
    usageCount: 45
  },
  {
    id: "TMPL-002",
    name: "Geographic Mismatch",
    category: "Geography",
    description: "Flag transactions from unexpected or high-risk countries",
    supportedChannels: ["Online", "Mobile", "ATM"],
    previewLogic: "IF country NOT IN allowed_list OR distance > X km THEN action",
    usageCount: 38
  },
  {
    id: "TMPL-003",
    name: "High-Risk MCC",
    category: "MCC",
    description: "Block or alert on blacklisted merchant category codes",
    supportedChannels: ["Online", "POS"],
    previewLogic: "IF mcc_code IN blacklist AND amount > X THEN action",
    usageCount: 52
  },
  {
    id: "TMPL-004",
    name: "Amount Threshold",
    category: "Amount",
    description: "Flag transactions exceeding typical spending patterns",
    supportedChannels: ["Online", "POS", "Mobile"],
    previewLogic: "IF amount > threshold OR amount > avg_30d * X THEN action",
    usageCount: 67
  },
  {
    id: "TMPL-005",
    name: "New Device Risk",
    category: "Device",
    description: "Alert when transactions occur from unrecognized devices",
    supportedChannels: ["Online", "Mobile"],
    previewLogic: "IF device_fingerprint NOT IN known_devices THEN action",
    usageCount: 29
  },
  {
    id: "TMPL-006",
    name: "IP Reputation Check",
    category: "Network",
    description: "Block transactions from low-reputation IP addresses or VPNs",
    supportedChannels: ["Online"],
    previewLogic: "IF ip_reputation < X OR vpn_detected = true THEN action",
    usageCount: 41
  },
  {
    id: "TMPL-007",
    name: "Failed Auth Attempts",
    category: "Behavior",
    description: "Detect repeated failed authorization attempts",
    supportedChannels: ["Online", "POS", "Mobile", "ATM"],
    previewLogic: "IF failed_attempts >= X within Y minutes THEN action",
    usageCount: 34
  },
  {
    id: "TMPL-008",
    name: "Card Not Present Risk",
    category: "Behavior",
    description: "Enhanced checks for card-not-present transactions",
    supportedChannels: ["Online", "Mobile"],
    previewLogic: "IF card_present = false AND (cvv_fail OR avs_fail) THEN action",
    usageCount: 56
  }
];

// Deployment History Mock Data
export const deploymentHistory: DeploymentRecord[] = [
  {
    id: "DEP-001",
    ruleId: "RULE-010",
    ruleName: "First International",
    version: "v1.2",
    stage: "SANDBOX",
    status: "DEPLOYED",
    approvedBy: "Sarah Chen",
    deployedAt: "2026-02-08 12:30",
    notes: "Testing false positive reduction improvements"
  },
  {
    id: "DEP-002",
    ruleId: "RULE-008",
    ruleName: "VPN Detection",
    version: "v2.1",
    stage: "PRODUCTION",
    status: "DEPLOYED",
    approvedBy: "Michael Torres",
    deployedAt: "2026-02-03 15:25",
    notes: "Enhanced VPN detection with new IP reputation feed"
  },
  {
    id: "DEP-003",
    ruleId: "RULE-006",
    ruleName: "New Device",
    version: "v1.8",
    stage: "PRODUCTION",
    status: "DEPLOYED",
    approvedBy: "David Kim",
    deployedAt: "2026-02-05 08:35",
    notes: "Updated device fingerprinting algorithm"
  },
  {
    id: "DEP-004",
    ruleId: "RULE-011",
    ruleName: "Weekend High Amount",
    version: "v1.0",
    stage: "SANDBOX",
    status: "PENDING",
    notes: "Awaiting approval for staging deployment"
  },
  {
    id: "DEP-005",
    ruleId: "RULE-003",
    ruleName: "Velocity Check",
    version: "v3.2",
    stage: "STAGING",
    status: "APPROVED",
    approvedBy: "Sarah Chen",
    notes: "Ready for production deployment"
  },
  {
    id: "DEP-006",
    ruleId: "RULE-002",
    ruleName: "Unusual Amount",
    version: "v2.5",
    stage: "PRODUCTION",
    status: "ROLLED_BACK",
    approvedBy: "Michael Torres",
    deployedAt: "2026-01-22 14:15",
    notes: "Rolled back due to high false positive rate. Investigating."
  }
];

export const ruleLibraryKPIs = {
  totalRules: 12,
  activeRules: 9,
  sandboxRules: 2,
  inactiveRules: 1,
  avgFalsePositiveRate: 7.8
};
