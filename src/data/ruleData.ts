export interface Rule {
  id: string;
  name: string;
  hits: number;
  blocks: number;
  blockRate: number;
  falsePositiveRate: number;
  blockedAmount: number;
  status: "Healthy" | "Noisy" | "Critical";
  category: string;
  actionType: "BLOCK" | "ALERT" | "CASE";
  activeSince: string;
  description: string;
  channels: string[];
  logic: {
    conditions: Array<{
      field: string;
      operator: string;
      value: string | number;
      timeWindow?: string;
    }>;
    logicalOperator: "AND" | "OR" | "FOLLOWED_BY";
    scope: {
      channels: string[];
      transactionTypes?: string[];
    };
  };
}

// Mock rules data
export const rules: Rule[] = [
  {
    id: "RULE-001",
    name: "High Risk Country",
    hits: 1245,
    blocks: 312,
    blockRate: 25.1,
    falsePositiveRate: 3.2,
    blockedAmount: 487532.50,
    status: "Healthy",
    category: "Geography",
    actionType: "BLOCK",
    activeSince: "2024-01-15",
    description: "Blocks transactions from high-risk countries with elevated fraud patterns",
    channels: ["Online", "Mobile"],
    logic: {
      conditions: [
        { field: "country_code", operator: "IN", value: "NG, RU, CN" },
        { field: "transaction_amount", operator: ">", value: 1000 }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online", "Mobile"],
        transactionTypes: ["Purchase"]
      }
    }
  },
  {
    id: "RULE-002",
    name: "Unusual Amount",
    hits: 2156,
    blocks: 245,
    blockRate: 11.4,
    falsePositiveRate: 12.5,
    blockedAmount: 892345.20,
    status: "Noisy",
    category: "Transaction",
    actionType: "BLOCK",
    activeSince: "2023-08-22",
    description: "Flags transactions that deviate significantly from user's spending pattern",
    channels: ["Online", "POS", "Mobile"],
    logic: {
      conditions: [
        { field: "amount_deviation", operator: ">", value: "200%", timeWindow: "from avg_30_days" },
        { field: "transaction_amount", operator: ">", value: 500 }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online", "POS", "Mobile"],
        transactionTypes: ["Purchase", "Withdrawal"]
      }
    }
  },
  {
    id: "RULE-003",
    name: "Velocity Check",
    hits: 987,
    blocks: 198,
    blockRate: 20.1,
    falsePositiveRate: 4.8,
    blockedAmount: 345678.90,
    status: "Healthy",
    category: "Behavior",
    actionType: "BLOCK",
    activeSince: "2024-03-10",
    description: "Detects abnormal transaction velocity within short timeframes",
    channels: ["Online", "Mobile"],
    logic: {
      conditions: [
        { field: "transaction_count", operator: ">", value: 5, timeWindow: "within 1 minute" },
        { field: "distinct_merchants", operator: ">", value: 3, timeWindow: "within 5 minutes" }
      ],
      logicalOperator: "OR",
      scope: {
        channels: ["Online", "Mobile"],
        transactionTypes: ["Purchase"]
      }
    }
  },
  {
    id: "RULE-004",
    name: "Blacklisted MCC",
    hits: 756,
    blocks: 156,
    blockRate: 20.6,
    falsePositiveRate: 2.1,
    blockedAmount: 234567.80,
    status: "Healthy",
    category: "Merchant",
    actionType: "BLOCK",
    activeSince: "2023-11-05",
    description: "Blocks transactions at merchant categories with high fraud rates",
    channels: ["Online", "POS"],
    logic: {
      conditions: [
        { field: "mcc_code", operator: "IN", value: "5999, 5732, 5944" },
        { field: "merchant_risk_score", operator: ">=", value: 80 }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online", "POS"],
        transactionTypes: ["Purchase"]
      }
    }
  },
  {
    id: "RULE-005",
    name: "Unusual Location",
    hits: 1543,
    blocks: 124,
    blockRate: 8.0,
    falsePositiveRate: 15.3,
    blockedAmount: 187432.10,
    status: "Critical",
    category: "Geography",
    actionType: "ALERT",
    activeSince: "2024-02-18",
    description: "Alerts on transactions from unexpected geographic locations",
    channels: ["Online", "Mobile", "ATM"],
    logic: {
      conditions: [
        { field: "distance_from_last_tx", operator: ">", value: "500 km", timeWindow: "within 30 minutes" },
        { field: "country_change", operator: "=", value: "true" }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online", "Mobile", "ATM"],
        transactionTypes: ["Purchase", "Withdrawal"]
      }
    }
  },
  {
    id: "RULE-006",
    name: "New Device",
    hits: 2345,
    blocks: 89,
    blockRate: 3.8,
    falsePositiveRate: 8.7,
    blockedAmount: 123456.50,
    status: "Noisy",
    category: "Device",
    actionType: "ALERT",
    activeSince: "2024-01-28",
    description: "Monitors transactions from previously unseen devices",
    channels: ["Online", "Mobile"],
    logic: {
      conditions: [
        { field: "device_fingerprint", operator: "NOT_IN", value: "known_devices" },
        { field: "transaction_amount", operator: ">", value: 100 }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online", "Mobile"],
        transactionTypes: ["Purchase"]
      }
    }
  },
  {
    id: "RULE-007",
    name: "Large Transaction",
    hits: 432,
    blocks: 267,
    blockRate: 61.8,
    falsePositiveRate: 1.5,
    blockedAmount: 1234567.00,
    status: "Healthy",
    category: "Transaction",
    actionType: "BLOCK",
    activeSince: "2023-09-12",
    description: "Blocks unusually large transaction amounts above threshold",
    channels: ["Online", "POS"],
    logic: {
      conditions: [
        { field: "transaction_amount", operator: ">", value: 5000 },
        { field: "cardholder_limit", operator: "<", value: "transaction_amount" }
      ],
      logicalOperator: "OR",
      scope: {
        channels: ["Online", "POS"],
        transactionTypes: ["Purchase"]
      }
    }
  },
  {
    id: "RULE-008",
    name: "VPN Detection",
    hits: 1876,
    blocks: 445,
    blockRate: 23.7,
    falsePositiveRate: 6.2,
    blockedAmount: 567890.30,
    status: "Healthy",
    category: "Network",
    actionType: "BLOCK",
    activeSince: "2024-04-01",
    description: "Identifies and blocks transactions routed through VPN services",
    channels: ["Online"],
    logic: {
      conditions: [
        { field: "vpn_detected", operator: "=", value: "true" },
        { field: "ip_reputation_score", operator: "<", value: 30 }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online"],
        transactionTypes: ["Purchase", "Withdrawal"]
      }
    }
  },
  {
    id: "RULE-009",
    name: "Multiple Failed Attempts",
    hits: 654,
    blocks: 512,
    blockRate: 78.3,
    falsePositiveRate: 0.8,
    blockedAmount: 98765.40,
    status: "Healthy",
    category: "Behavior",
    actionType: "BLOCK",
    activeSince: "2023-12-08",
    description: "Blocks cards with repeated failed authorization attempts",
    channels: ["Online", "POS", "Mobile", "ATM"],
    logic: {
      conditions: [
        { field: "failed_attempts", operator: ">=", value: 3, timeWindow: "within 10 minutes" },
        { field: "attempt_type", operator: "=", value: "incorrect_cvv" }
      ],
      logicalOperator: "FOLLOWED_BY",
      scope: {
        channels: ["Online", "POS", "Mobile", "ATM"],
        transactionTypes: ["Purchase", "Withdrawal"]
      }
    }
  },
  {
    id: "RULE-010",
    name: "First International",
    hits: 1234,
    blocks: 156,
    blockRate: 12.6,
    falsePositiveRate: 18.9,
    blockedAmount: 345678.20,
    status: "Critical",
    category: "Geography",
    actionType: "CASE",
    activeSince: "2024-05-15",
    description: "Creates case for review on first international transactions",
    channels: ["Online", "POS"],
    logic: {
      conditions: [
        { field: "international_tx_count", operator: "=", value: 0, timeWindow: "in history" },
        { field: "transaction_country", operator: "!=", value: "cardholder_country" }
      ],
      logicalOperator: "AND",
      scope: {
        channels: ["Online", "POS"],
        transactionTypes: ["Purchase"]
      }
    }
  }
];

// Rule performance KPIs
export const ruleKPIs = {
  activeRules: 47,
  rulesTriggered: 13228,
  avgBlockRate: 24.5,
  avgFalsePositiveRate: 7.3
};

// Rule hits vs blocks trend over time
export const ruleHitsTrendData = [
  { time: "Mon", hits: 1845, blocks: 432 },
  { time: "Tue", hits: 2156, blocks: 523 },
  { time: "Wed", hits: 1987, blocks: 489 },
  { time: "Thu", hits: 2234, blocks: 556 },
  { time: "Fri", hits: 2456, blocks: 612 },
  { time: "Sat", hits: 1876, blocks: 467 },
  { time: "Sun", hits: 1674, blocks: 398 },
];

// False positive rate by rule (top 10)
export const falsePositiveByRuleData = [
  { rule: "First International", rate: 18.9 },
  { rule: "Unusual Location", rate: 15.3 },
  { rule: "Unusual Amount", rate: 12.5 },
  { rule: "New Device", rate: 8.7 },
  { rule: "VPN Detection", rate: 6.2 },
  { rule: "Velocity Check", rate: 4.8 },
  { rule: "High Risk Country", rate: 3.2 },
  { rule: "Blacklisted MCC", rate: 2.1 },
  { rule: "Large Transaction", rate: 1.5 },
  { rule: "Multiple Failed", rate: 0.8 },
];

// Blocked amount by rule (top 10)
export const blockedAmountByRuleData = [
  { rule: "Large Transaction", amount: 1234567 },
  { rule: "Unusual Amount", amount: 892345 },
  { rule: "VPN Detection", amount: 567890 },
  { rule: "High Risk Country", amount: 487533 },
  { rule: "Velocity Check", amount: 345679 },
  { rule: "First International", amount: 345678 },
  { rule: "Blacklisted MCC", amount: 234568 },
  { rule: "Unusual Location", amount: 187432 },
  { rule: "New Device", amount: 123457 },
  { rule: "Multiple Failed", amount: 98765 },
];

// Rules by channel
export const rulesByChannelData = [
  { channel: "Online", blocks: 1847 },
  { channel: "Mobile", blocks: 892 },
  { channel: "POS", blocks: 567 },
  { channel: "ATM", blocks: 234 },
];

// Rules by MCC
export const rulesByMCCData = [
  { mcc: "5999 - Online Retail", blocks: 456 },
  { mcc: "5732 - Electronics", blocks: 389 },
  { mcc: "5944 - Jewelry", blocks: 312 },
  { mcc: "5411 - Grocery", blocks: 234 },
  { mcc: "5812 - Restaurants", blocks: 178 },
];

// Rule detail mini trend (7 days)
export const ruleDetailTrendData = [
  { day: "Day 1", hits: 145, blocks: 32 },
  { day: "Day 2", hits: 167, blocks: 41 },
  { day: "Day 3", hits: 134, blocks: 28 },
  { day: "Day 4", hits: 189, blocks: 47 },
  { day: "Day 5", hits: 201, blocks: 52 },
  { day: "Day 6", hits: 178, blocks: 44 },
  { day: "Day 7", hits: 156, blocks: 38 },
];