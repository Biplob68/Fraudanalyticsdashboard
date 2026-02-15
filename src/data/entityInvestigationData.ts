// Mock data structure aligned with backend API response for entity investigation
// One transaction binds to exactly 1 Device, 1 IP, 1 Merchant, 1 Card

export interface BaseTransaction {
  id: string;
  cardId: string; // Masked format
  deviceId: string;
  ipAddress: string;
  merchantId: string;
  merchantName: string;
  amount: string;
  timestamp: string;
  decision: "BLOCK" | "ALERT" | "CASE";
  channel: string; // Card Network
  accessChannel: string;
  transactionType: string;
  riskScore: number;
}

export interface RelatedTransaction {
  id: string;
  decision: "BLOCK" | "ALERT" | "CASE";
  amount: string;
  date: string;
  channel: string;
  ruleHits: number;
}

export interface EntitySummary {
  totalTransactions: number;
  blockCount: number;
  alertCount: number;
  caseCount: number;
  lastActivity: string;
  riskLevel: "High Risk" | "Medium Risk" | "Low Risk";
}

export interface EntityLink {
  entityValue: string;
  entityLabel?: string;
  summary: EntitySummary;
  transactions: RelatedTransaction[];
}

export interface EntityInvestigation {
  baseTransaction: BaseTransaction;
  deviceLink: EntityLink; // Single entity, not array
  ipLink: EntityLink; // Single entity, not array
  merchantLink: EntityLink; // Single entity, not array
  cardLink: EntityLink; // Single entity, not array
}

// Calculate risk level based on BLOCK ratio
const calculateRiskLevel = (blockCount: number, totalTransactions: number): "High Risk" | "Medium Risk" | "Low Risk" => {
  const blockRatio = blockCount / totalTransactions;
  if (blockRatio > 0.5) return "High Risk";
  if (blockRatio > 0.2) return "Medium Risk";
  return "Low Risk";
};

// Mock API response - ONE base transaction binds to ONE of each entity type
export const mockEntityInvestigation: EntityInvestigation = {
  baseTransaction: {
    id: "TXN-458392",
    cardId: "**** **** **** 1234",
    deviceId: "D-7788",
    ipAddress: "192.168.45.12",
    merchantId: "MERCH-1023",
    merchantName: "TechStore Electronics",
    amount: "$2,350.00",
    timestamp: "2024-02-15 14:23:11 UTC",
    decision: "BLOCK",
    channel: "VISA",
    accessChannel: "ECOM",
    transactionType: "Purchase",
    riskScore: 87,
  },
  deviceLink: {
    entityValue: "D-7788",
    entityLabel: "iPhone 12 Pro",
    summary: {
      totalTransactions: 15,
      blockCount: 8,
      alertCount: 5,
      caseCount: 2,
      lastActivity: "2 hours ago",
      riskLevel: "High Risk",
    },
    transactions: [
      {
        id: "TXN-458392",
        decision: "BLOCK",
        amount: "$2,350.00",
        date: "2024-02-15 14:23",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458391",
        decision: "BLOCK",
        amount: "$1,200.00",
        date: "2024-02-15 14:15",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458385",
        decision: "ALERT",
        amount: "$890.00",
        date: "2024-02-15 13:45",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458370",
        decision: "BLOCK",
        amount: "$3,200.00",
        date: "2024-02-15 12:30",
        channel: "VISA",
        ruleHits: 4,
      },
      {
        id: "TXN-458355",
        decision: "ALERT",
        amount: "$450.00",
        date: "2024-02-15 11:20",
        channel: "AMEX",
        ruleHits: 1,
      },
      {
        id: "TXN-458340",
        decision: "BLOCK",
        amount: "$1,800.00",
        date: "2024-02-15 10:15",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458325",
        decision: "CASE",
        amount: "$950.00",
        date: "2024-02-15 09:45",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458310",
        decision: "ALERT",
        amount: "$670.00",
        date: "2024-02-15 08:30",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458295",
        decision: "BLOCK",
        amount: "$2,100.00",
        date: "2024-02-15 07:15",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458280",
        decision: "ALERT",
        amount: "$540.00",
        date: "2024-02-15 06:00",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458265",
        decision: "BLOCK",
        amount: "$1,950.00",
        date: "2024-02-15 04:45",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458250",
        decision: "CASE",
        amount: "$780.00",
        date: "2024-02-15 03:30",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458235",
        decision: "ALERT",
        amount: "$620.00",
        date: "2024-02-15 02:15",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458220",
        decision: "BLOCK",
        amount: "$1,400.00",
        date: "2024-02-15 01:00",
        channel: "AMEX",
        ruleHits: 3,
      },
      {
        id: "TXN-458205",
        decision: "ALERT",
        amount: "$490.00",
        date: "2024-02-14 23:45",
        channel: "VISA",
        ruleHits: 1,
      },
    ],
  },
  ipLink: {
    entityValue: "192.168.45.12",
    entityLabel: "New York, US",
    summary: {
      totalTransactions: 23,
      blockCount: 14,
      alertCount: 7,
      caseCount: 2,
      lastActivity: "1 hour ago",
      riskLevel: "High Risk",
    },
    transactions: [
      {
        id: "TXN-458392",
        decision: "BLOCK",
        amount: "$2,350.00",
        date: "2024-02-15 14:23",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458388",
        decision: "BLOCK",
        amount: "$1,900.00",
        date: "2024-02-15 14:00",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458380",
        decision: "ALERT",
        amount: "$750.00",
        date: "2024-02-15 13:30",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458375",
        decision: "BLOCK",
        amount: "$2,800.00",
        date: "2024-02-15 13:00",
        channel: "AMEX",
        ruleHits: 4,
      },
      {
        id: "TXN-458365",
        decision: "BLOCK",
        amount: "$1,450.00",
        date: "2024-02-15 12:15",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458360",
        decision: "ALERT",
        amount: "$580.00",
        date: "2024-02-15 11:45",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458345",
        decision: "CASE",
        amount: "$1,050.00",
        date: "2024-02-15 10:30",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458335",
        decision: "BLOCK",
        amount: "$2,200.00",
        date: "2024-02-15 09:45",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458320",
        decision: "ALERT",
        amount: "$690.00",
        date: "2024-02-15 08:30",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458305",
        decision: "BLOCK",
        amount: "$1,750.00",
        date: "2024-02-15 07:15",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458290",
        decision: "BLOCK",
        amount: "$1,950.00",
        date: "2024-02-15 06:00",
        channel: "AMEX",
        ruleHits: 3,
      },
      {
        id: "TXN-458275",
        decision: "ALERT",
        amount: "$520.00",
        date: "2024-02-15 04:45",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458260",
        decision: "BLOCK",
        amount: "$2,100.00",
        date: "2024-02-15 03:30",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458245",
        decision: "CASE",
        amount: "$880.00",
        date: "2024-02-15 02:15",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458230",
        decision: "BLOCK",
        amount: "$1,650.00",
        date: "2024-02-15 01:00",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458215",
        decision: "ALERT",
        amount: "$430.00",
        date: "2024-02-14 23:45",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458200",
        decision: "BLOCK",
        amount: "$1,850.00",
        date: "2024-02-14 22:30",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458185",
        decision: "BLOCK",
        amount: "$2,300.00",
        date: "2024-02-14 21:15",
        channel: "AMEX",
        ruleHits: 4,
      },
      {
        id: "TXN-458170",
        decision: "ALERT",
        amount: "$590.00",
        date: "2024-02-14 20:00",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458155",
        decision: "BLOCK",
        amount: "$1,700.00",
        date: "2024-02-14 18:45",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458140",
        decision: "ALERT",
        amount: "$460.00",
        date: "2024-02-14 17:30",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458125",
        decision: "BLOCK",
        amount: "$1,950.00",
        date: "2024-02-14 16:15",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458110",
        decision: "ALERT",
        amount: "$380.00",
        date: "2024-02-14 15:00",
        channel: "Mastercard",
        ruleHits: 1,
      },
    ],
  },
  merchantLink: {
    entityValue: "MERCH-1023",
    entityLabel: "TechStore Electronics",
    summary: {
      totalTransactions: 18,
      blockCount: 10,
      alertCount: 6,
      caseCount: 2,
      lastActivity: "3 hours ago",
      riskLevel: "High Risk",
    },
    transactions: [
      {
        id: "TXN-458392",
        decision: "BLOCK",
        amount: "$2,350.00",
        date: "2024-02-15 14:23",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458380",
        decision: "BLOCK",
        amount: "$1,800.00",
        date: "2024-02-15 13:30",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458370",
        decision: "ALERT",
        amount: "$920.00",
        date: "2024-02-15 12:45",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458355",
        decision: "BLOCK",
        amount: "$2,600.00",
        date: "2024-02-15 11:30",
        channel: "AMEX",
        ruleHits: 4,
      },
      {
        id: "TXN-458340",
        decision: "BLOCK",
        amount: "$1,400.00",
        date: "2024-02-15 10:15",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458325",
        decision: "CASE",
        amount: "$1,150.00",
        date: "2024-02-15 09:00",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458310",
        decision: "ALERT",
        amount: "$780.00",
        date: "2024-02-15 07:45",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458295",
        decision: "BLOCK",
        amount: "$2,100.00",
        date: "2024-02-15 06:30",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458280",
        decision: "ALERT",
        amount: "$640.00",
        date: "2024-02-15 05:15",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458265",
        decision: "BLOCK",
        amount: "$1,950.00",
        date: "2024-02-15 04:00",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458250",
        decision: "ALERT",
        amount: "$570.00",
        date: "2024-02-15 02:45",
        channel: "AMEX",
        ruleHits: 1,
      },
      {
        id: "TXN-458235",
        decision: "BLOCK",
        amount: "$1,750.00",
        date: "2024-02-15 01:30",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458220",
        decision: "CASE",
        amount: "$890.00",
        date: "2024-02-15 00:15",
        channel: "Mastercard",
        ruleHits: 2,
      },
      {
        id: "TXN-458205",
        decision: "ALERT",
        amount: "$620.00",
        date: "2024-02-14 23:00",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458190",
        decision: "BLOCK",
        amount: "$2,200.00",
        date: "2024-02-14 21:45",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458175",
        decision: "ALERT",
        amount: "$480.00",
        date: "2024-02-14 20:30",
        channel: "Mastercard",
        ruleHits: 1,
      },
      {
        id: "TXN-458160",
        decision: "BLOCK",
        amount: "$1,850.00",
        date: "2024-02-14 19:15",
        channel: "AMEX",
        ruleHits: 2,
      },
      {
        id: "TXN-458145",
        decision: "ALERT",
        amount: "$540.00",
        date: "2024-02-14 18:00",
        channel: "VISA",
        ruleHits: 1,
      },
    ],
  },
  cardLink: {
    entityValue: "**** **** **** 1234",
    entityLabel: "VISA Card ending 1234",
    summary: {
      totalTransactions: 27,
      blockCount: 9,
      alertCount: 14,
      caseCount: 4,
      lastActivity: "30 minutes ago",
      riskLevel: "Medium Risk",
    },
    transactions: [
      {
        id: "TXN-458392",
        decision: "BLOCK",
        amount: "$2,350.00",
        date: "2024-02-15 14:23",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458389",
        decision: "ALERT",
        amount: "$680.00",
        date: "2024-02-15 14:10",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458383",
        decision: "ALERT",
        amount: "$920.00",
        date: "2024-02-15 13:50",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458377",
        decision: "BLOCK",
        amount: "$1,800.00",
        date: "2024-02-15 13:20",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458368",
        decision: "ALERT",
        amount: "$550.00",
        date: "2024-02-15 12:40",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458358",
        decision: "CASE",
        amount: "$1,200.00",
        date: "2024-02-15 11:50",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458348",
        decision: "ALERT",
        amount: "$420.00",
        date: "2024-02-15 11:00",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458338",
        decision: "BLOCK",
        amount: "$1,650.00",
        date: "2024-02-15 10:10",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458328",
        decision: "ALERT",
        amount: "$780.00",
        date: "2024-02-15 09:20",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458318",
        decision: "ALERT",
        amount: "$490.00",
        date: "2024-02-15 08:30",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458308",
        decision: "BLOCK",
        amount: "$2,100.00",
        date: "2024-02-15 07:40",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458298",
        decision: "ALERT",
        amount: "$620.00",
        date: "2024-02-15 06:50",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458288",
        decision: "CASE",
        amount: "$950.00",
        date: "2024-02-15 06:00",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458278",
        decision: "ALERT",
        amount: "$530.00",
        date: "2024-02-15 05:10",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458268",
        decision: "BLOCK",
        amount: "$1,750.00",
        date: "2024-02-15 04:20",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458258",
        decision: "ALERT",
        amount: "$670.00",
        date: "2024-02-15 03:30",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458248",
        decision: "ALERT",
        amount: "$440.00",
        date: "2024-02-15 02:40",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458238",
        decision: "CASE",
        amount: "$1,100.00",
        date: "2024-02-15 01:50",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458228",
        decision: "BLOCK",
        amount: "$1,900.00",
        date: "2024-02-15 01:00",
        channel: "VISA",
        ruleHits: 3,
      },
      {
        id: "TXN-458218",
        decision: "ALERT",
        amount: "$590.00",
        date: "2024-02-15 00:10",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458208",
        decision: "ALERT",
        amount: "$710.00",
        date: "2024-02-14 23:20",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458198",
        decision: "BLOCK",
        amount: "$1,550.00",
        date: "2024-02-14 22:30",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458188",
        decision: "ALERT",
        amount: "$480.00",
        date: "2024-02-14 21:40",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458178",
        decision: "CASE",
        amount: "$880.00",
        date: "2024-02-14 20:50",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458168",
        decision: "ALERT",
        amount: "$630.00",
        date: "2024-02-14 20:00",
        channel: "VISA",
        ruleHits: 1,
      },
      {
        id: "TXN-458158",
        decision: "BLOCK",
        amount: "$1,850.00",
        date: "2024-02-14 19:10",
        channel: "VISA",
        ruleHits: 2,
      },
      {
        id: "TXN-458148",
        decision: "ALERT",
        amount: "$520.00",
        date: "2024-02-14 18:20",
        channel: "VISA",
        ruleHits: 1,
      },
    ],
  },
};
