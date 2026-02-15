export type CaseStatus = "OPEN" | "UNDER_REVIEW" | "CONFIRMED_FRAUD" | "FALSE_POSITIVE" | "CLOSED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Case {
  id: string;
  transactionId: string;
  riskLevel: RiskLevel;
  status: CaseStatus;
  assignedAnalyst: string;
  createdAt: string;
  lastUpdated: string;
  amount: number;
  channel: string;
  merchantName: string;
  cardLast4: string;
  triggeredRules: string[];
  notes: CaseNote[];
  evidenceAttachments: Evidence[];
}

export interface CaseNote {
  id: string;
  analyst: string;
  timestamp: string;
  content: string;
}

export interface Evidence {
  id: string;
  type: "screenshot" | "document" | "kyc" | "note";
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

export const cases: Case[] = [
  {
    id: "CASE-2024-001",
    transactionId: "TXN-8765432109",
    riskLevel: "CRITICAL",
    status: "OPEN",
    assignedAnalyst: "Sarah Chen",
    createdAt: "2026-02-09 08:15:23",
    lastUpdated: "2026-02-09 08:15:23",
    amount: 4850.00,
    channel: "Online",
    merchantName: "Electronics Global Ltd",
    cardLast4: "4521",
    triggeredRules: ["RULE-001", "RULE-002", "RULE-008"],
    notes: [],
    evidenceAttachments: [],
  },
  {
    id: "CASE-2024-002",
    transactionId: "TXN-7654321098",
    riskLevel: "HIGH",
    status: "UNDER_REVIEW",
    assignedAnalyst: "Michael Torres",
    createdAt: "2026-02-09 07:42:11",
    lastUpdated: "2026-02-09 08:10:45",
    amount: 2340.50,
    channel: "Mobile",
    merchantName: "Fashion Store XYZ",
    cardLast4: "3892",
    triggeredRules: ["RULE-003", "RULE-005"],
    notes: [
      {
        id: "NOTE-001",
        analyst: "Michael Torres",
        timestamp: "2026-02-09 08:10:45",
        content: "Contacted customer via phone. Customer confirms transaction. Awaiting email confirmation.",
      },
    ],
    evidenceAttachments: [],
  },
  {
    id: "CASE-2024-003",
    transactionId: "TXN-6543210987",
    riskLevel: "MEDIUM",
    status: "CONFIRMED_FRAUD",
    assignedAnalyst: "Sarah Chen",
    createdAt: "2026-02-08 16:22:33",
    lastUpdated: "2026-02-09 09:30:12",
    amount: 890.25,
    channel: "POS",
    merchantName: "Gas Station ABC",
    cardLast4: "7721",
    triggeredRules: ["RULE-004"],
    notes: [
      {
        id: "NOTE-002",
        analyst: "Sarah Chen",
        timestamp: "2026-02-09 09:30:12",
        content: "Customer reported card stolen on Feb 7. Transaction occurred on Feb 8. Confirmed fraud.",
      },
    ],
    evidenceAttachments: [
      {
        id: "EVD-001",
        type: "document",
        name: "police_report.pdf",
        uploadedBy: "Sarah Chen",
        uploadedAt: "2026-02-09 09:25:00",
      },
    ],
  },
  {
    id: "CASE-2024-004",
    transactionId: "TXN-5432109876",
    riskLevel: "HIGH",
    status: "FALSE_POSITIVE",
    assignedAnalyst: "David Kim",
    createdAt: "2026-02-08 14:18:45",
    lastUpdated: "2026-02-09 10:15:30",
    amount: 1250.00,
    channel: "Online",
    merchantName: "Hotel Booking Service",
    cardLast4: "5532",
    triggeredRules: ["RULE-005"],
    notes: [
      {
        id: "NOTE-003",
        analyst: "David Kim",
        timestamp: "2026-02-09 10:15:30",
        content: "Customer traveling for business. Legitimate transaction. Marked as false positive.",
      },
    ],
    evidenceAttachments: [],
  },
  {
    id: "CASE-2024-005",
    transactionId: "TXN-4321098765",
    riskLevel: "CRITICAL",
    status: "UNDER_REVIEW",
    assignedAnalyst: "Sarah Chen",
    createdAt: "2026-02-09 06:05:12",
    lastUpdated: "2026-02-09 07:45:20",
    amount: 7500.00,
    channel: "Online",
    merchantName: "Luxury Goods Inc",
    cardLast4: "9103",
    triggeredRules: ["RULE-001", "RULE-007", "RULE-008"],
    notes: [
      {
        id: "NOTE-004",
        analyst: "Sarah Chen",
        timestamp: "2026-02-09 07:45:20",
        content: "Multiple high-risk indicators. VPN detected. Unable to reach customer. Escalating.",
      },
    ],
    evidenceAttachments: [
      {
        id: "EVD-002",
        type: "screenshot",
        name: "vpn_detection.png",
        uploadedBy: "Sarah Chen",
        uploadedAt: "2026-02-09 07:40:00",
      },
    ],
  },
  {
    id: "CASE-2024-006",
    transactionId: "TXN-3210987654",
    riskLevel: "MEDIUM",
    status: "OPEN",
    assignedAnalyst: "Michael Torres",
    createdAt: "2026-02-09 05:33:47",
    lastUpdated: "2026-02-09 05:33:47",
    amount: 567.80,
    channel: "Mobile",
    merchantName: "Gaming Platform",
    cardLast4: "2214",
    triggeredRules: ["RULE-006"],
    notes: [],
    evidenceAttachments: [],
  },
  {
    id: "CASE-2024-007",
    transactionId: "TXN-2109876543",
    riskLevel: "LOW",
    status: "CLOSED",
    assignedAnalyst: "David Kim",
    createdAt: "2026-02-07 11:20:15",
    lastUpdated: "2026-02-08 14:22:30",
    amount: 125.50,
    channel: "POS",
    merchantName: "Coffee Shop",
    cardLast4: "8876",
    triggeredRules: ["RULE-009"],
    notes: [
      {
        id: "NOTE-005",
        analyst: "David Kim",
        timestamp: "2026-02-08 14:22:30",
        content: "Routine transaction. No fraud indicators found. Case closed.",
      },
    ],
    evidenceAttachments: [],
  },
];

export const caseKPIs = {
  totalCases: 147,
  openCases: 42,
  underReview: 35,
  confirmedFraud: 28,
  falsePositives: 31,
  closedCases: 11,
  avgResolutionTime: "4.2 hours",
};
