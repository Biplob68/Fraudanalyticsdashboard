export interface Transaction {
  id: string;
  time: string;
  amount: number;
  country: string;
  channel: string;
  merchant: string;
  txType: string;
  action: "Approved" | "Blocked" | "Review" | "Flagged";
  riskScore: number;
  cardLast4: string;
  triggeredRules: string[];
  riskSignals: string[];
}

// Mock transactions data
export const transactions: Transaction[] = [
  {
    id: "TX001",
    time: "2026-01-30 14:23:45",
    amount: 1249.99,
    country: "USA",
    channel: "Online",
    merchant: "ElectroShop Inc",
    txType: "Purchase",
    action: "Blocked",
    riskScore: 92,
    cardLast4: "4532",
    triggeredRules: ["High Risk Country", "Unusual Amount"],
    riskSignals: ["Velocity spike", "New device", "VPN detected"]
  },
  {
    id: "TX002",
    time: "2026-01-30 14:18:22",
    amount: 89.50,
    country: "UK",
    channel: "Mobile",
    merchant: "Coffee Palace",
    txType: "Purchase",
    action: "Approved",
    riskScore: 12,
    cardLast4: "8821",
    triggeredRules: [],
    riskSignals: []
  },
  {
    id: "TX003",
    time: "2026-01-30 14:15:10",
    amount: 3450.00,
    country: "Nigeria",
    channel: "Online",
    merchant: "Luxury Goods Ltd",
    txType: "Purchase",
    action: "Blocked",
    riskScore: 95,
    cardLast4: "2314",
    triggeredRules: ["High Risk Country", "Large Transaction", "Unusual MCC"],
    riskSignals: ["First transaction in country", "High value", "Multiple failed attempts"]
  },
  {
    id: "TX004",
    time: "2026-01-30 14:12:33",
    amount: 45.00,
    country: "Canada",
    channel: "POS",
    merchant: "Gas Station 24",
    txType: "Purchase",
    action: "Approved",
    riskScore: 8,
    cardLast4: "9987",
    triggeredRules: [],
    riskSignals: []
  },
  {
    id: "TX005",
    time: "2026-01-30 14:09:55",
    amount: 899.99,
    country: "Germany",
    channel: "Online",
    merchant: "TechWorld",
    txType: "Purchase",
    action: "Review",
    riskScore: 67,
    cardLast4: "5543",
    triggeredRules: ["Velocity Check"],
    riskSignals: ["Multiple transactions today", "New merchant"]
  },
  {
    id: "TX006",
    time: "2026-01-30 14:05:41",
    amount: 2100.00,
    country: "Brazil",
    channel: "Online",
    merchant: "Fashion Store",
    txType: "Purchase",
    action: "Blocked",
    riskScore: 88,
    cardLast4: "7621",
    triggeredRules: ["High Risk Country", "Unusual Amount"],
    riskSignals: ["Geolocation mismatch", "High value"]
  },
  {
    id: "TX007",
    time: "2026-01-30 14:02:15",
    amount: 15.99,
    country: "USA",
    channel: "Mobile",
    merchant: "Streaming Service",
    txType: "Subscription",
    action: "Approved",
    riskScore: 5,
    cardLast4: "3344",
    triggeredRules: [],
    riskSignals: []
  },
  {
    id: "TX008",
    time: "2026-01-30 13:58:30",
    amount: 567.80,
    country: "India",
    channel: "Online",
    merchant: "Electronics Hub",
    txType: "Purchase",
    action: "Flagged",
    riskScore: 72,
    cardLast4: "1122",
    triggeredRules: ["Unusual Location"],
    riskSignals: ["New IP address", "Different timezone"]
  },
  {
    id: "TX009",
    time: "2026-01-30 13:55:12",
    amount: 120.00,
    country: "France",
    channel: "POS",
    merchant: "Restaurant Le Bon",
    txType: "Purchase",
    action: "Approved",
    riskScore: 10,
    cardLast4: "6677",
    triggeredRules: [],
    riskSignals: []
  },
  {
    id: "TX010",
    time: "2026-01-30 13:50:45",
    amount: 4500.00,
    country: "Russia",
    channel: "Online",
    merchant: "Jewelry Express",
    txType: "Purchase",
    action: "Blocked",
    riskScore: 98,
    cardLast4: "9900",
    triggeredRules: ["High Risk Country", "Large Transaction", "Blacklisted MCC"],
    riskSignals: ["First international transaction", "Very high value", "Suspicious pattern"]
  },
  {
    id: "TX011",
    time: "2026-01-30 13:45:20",
    amount: 32.50,
    country: "USA",
    channel: "Mobile",
    merchant: "Food Delivery Co",
    txType: "Purchase",
    action: "Approved",
    riskScore: 6,
    cardLast4: "4455",
    triggeredRules: [],
    riskSignals: []
  },
  {
    id: "TX012",
    time: "2026-01-30 13:40:08",
    amount: 1800.00,
    country: "China",
    channel: "Online",
    merchant: "Global Gadgets",
    txType: "Purchase",
    action: "Review",
    riskScore: 75,
    cardLast4: "2233",
    triggeredRules: ["Unusual Location", "High Value"],
    riskSignals: ["Different country", "High amount"]
  }
];

// Time series data for trends
export const transactionTrendData = [
  { time: "00:00", total: 245, blocked: 18 },
  { time: "03:00", total: 180, blocked: 12 },
  { time: "06:00", total: 320, blocked: 25 },
  { time: "09:00", total: 580, blocked: 45 },
  { time: "12:00", total: 720, blocked: 58 },
  { time: "15:00", total: 650, blocked: 52 },
  { time: "18:00", total: 890, blocked: 71 },
  { time: "21:00", total: 540, blocked: 43 },
];

export const blockRateTrendData = [
  { time: "00:00", rate: 7.3 },
  { time: "03:00", rate: 6.7 },
  { time: "06:00", rate: 7.8 },
  { time: "09:00", rate: 7.8 },
  { time: "12:00", rate: 8.1 },
  { time: "15:00", rate: 8.0 },
  { time: "18:00", rate: 8.0 },
  { time: "21:00", rate: 8.0 },
];

export const fraudDecisionLatencyData = [
  { time: "00:00", latency: 45 },
  { time: "03:00", latency: 42 },
  { time: "06:00", latency: 48 },
  { time: "09:00", latency: 52 },
  { time: "12:00", latency: 55 },
  { time: "15:00", latency: 53 },
  { time: "18:00", latency: 58 },
  { time: "21:00", latency: 50 },
];

export const actionDistributionData = [
  { name: "Approved", value: 8542, color: "#22c55e" },
  { name: "Blocked", value: 724, color: "#ef4444" },
  { name: "Review", value: 312, color: "#f59e0b" },
  { name: "Flagged", value: 187, color: "#eab308" },
];

export const fraudByChannelData = [
  { channel: "Online", count: 445 },
  { channel: "Mobile", count: 198 },
  { channel: "POS", count: 81 },
  { channel: "ATM", count: 52 },
];

export const fraudByTxTypeData = [
  { txType: "Purchase", count: 598 },
  { txType: "Withdrawal", count: 112 },
  { txType: "Subscription", count: 45 },
  { txType: "Refund", count: 21 },
];

export const fraudByCountryData = [
  { country: "USA", count: 245 },
  { country: "Nigeria", count: 189 },
  { country: "Russia", count: 156 },
  { country: "Brazil", count: 98 },
  { country: "China", count: 88 },
];

export const topBlockingRulesData = [
  { rule: "High Risk Country", count: 312 },
  { rule: "Unusual Amount", count: 245 },
  { rule: "Velocity Check", count: 198 },
  { rule: "Blacklisted MCC", count: 156 },
  { rule: "Unusual Location", count: 124 },
];

export const topMCCData = [
  { mcc: "5411 - Grocery", count: 89 },
  { mcc: "5999 - Online Retail", count: 145 },
  { mcc: "5732 - Electronics", count: 112 },
  { mcc: "5944 - Jewelry", count: 98 },
  { mcc: "5812 - Restaurants", count: 67 },
];

// KPI summary
export const kpiSummary = {
  totalTransactions: 9765,
  blockedTransactions: 724,
  blockRate: 7.4,
  blockedAmount: 2847532.50,
};