export type EntityType = "transaction" | "device" | "merchant" | "card" | "ip";

export interface Entity {
  id: string;
  type: EntityType;
  label: string;
  riskScore: number;
  metadata: Record<string, any>;
}

export interface EntityLink {
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

export interface EntityGraph {
  entities: Entity[];
  links: EntityLink[];
}

// Mock Entity Graph Data
export const mockEntityGraph: EntityGraph = {
  entities: [
    {
      id: "TXN-001",
      type: "transaction",
      label: "$4,850.00",
      riskScore: 95,
      metadata: {
        amount: 4850.00,
        timestamp: "2026-02-09 08:15:23",
        status: "BLOCKED"
      }
    },
    {
      id: "TXN-002",
      type: "transaction",
      label: "$2,340.50",
      riskScore: 78,
      metadata: {
        amount: 2340.50,
        timestamp: "2026-02-09 07:42:11",
        status: "ALERT"
      }
    },
    {
      id: "TXN-003",
      type: "transaction",
      label: "$7,500.00",
      riskScore: 92,
      metadata: {
        amount: 7500.00,
        timestamp: "2026-02-09 06:05:12",
        status: "BLOCKED"
      }
    },
    {
      id: "DEV-001",
      type: "device",
      label: "iPhone 13 Pro",
      riskScore: 85,
      metadata: {
        fingerprint: "a1b2c3d4e5f6",
        firstSeen: "2026-02-08",
        os: "iOS 17.2"
      }
    },
    {
      id: "DEV-002",
      type: "device",
      label: "Samsung Galaxy S23",
      riskScore: 45,
      metadata: {
        fingerprint: "x9y8z7w6v5u4",
        firstSeen: "2025-11-15",
        os: "Android 14"
      }
    },
    {
      id: "MERCH-001",
      type: "merchant",
      label: "Electronics Global Ltd",
      riskScore: 72,
      metadata: {
        mcc: "5732",
        country: "NG",
        riskCategory: "High"
      }
    },
    {
      id: "MERCH-002",
      type: "merchant",
      label: "Luxury Goods Inc",
      riskScore: 68,
      metadata: {
        mcc: "5944",
        country: "CN",
        riskCategory: "Medium"
      }
    },
    {
      id: "CARD-001",
      type: "card",
      label: "****4521",
      riskScore: 88,
      metadata: {
        issueDate: "2024-05-15",
        cardType: "Visa",
        status: "ACTIVE"
      }
    },
    {
      id: "CARD-002",
      type: "card",
      label: "****9103",
      riskScore: 75,
      metadata: {
        issueDate: "2023-12-20",
        cardType: "Mastercard",
        status: "ACTIVE"
      }
    },
    {
      id: "IP-001",
      type: "ip",
      label: "185.220.101.23",
      riskScore: 90,
      metadata: {
        country: "RU",
        vpnDetected: true,
        reputationScore: 25
      }
    },
    {
      id: "IP-002",
      type: "ip",
      label: "203.45.78.112",
      riskScore: 82,
      metadata: {
        country: "CN",
        vpnDetected: true,
        reputationScore: 30
      }
    }
  ],
  links: [
    { source: "TXN-001", target: "DEV-001", relationship: "used_device", strength: 1.0 },
    { source: "TXN-001", target: "MERCH-001", relationship: "at_merchant", strength: 1.0 },
    { source: "TXN-001", target: "CARD-001", relationship: "used_card", strength: 1.0 },
    { source: "TXN-001", target: "IP-001", relationship: "from_ip", strength: 1.0 },
    
    { source: "TXN-002", target: "DEV-001", relationship: "used_device", strength: 1.0 },
    { source: "TXN-002", target: "CARD-001", relationship: "used_card", strength: 1.0 },
    
    { source: "TXN-003", target: "DEV-001", relationship: "used_device", strength: 1.0 },
    { source: "TXN-003", target: "MERCH-002", relationship: "at_merchant", strength: 1.0 },
    { source: "TXN-003", target: "CARD-002", relationship: "used_card", strength: 1.0 },
    { source: "TXN-003", target: "IP-002", relationship: "from_ip", strength: 1.0 },
    
    { source: "DEV-002", target: "CARD-001", relationship: "used_with", strength: 0.8 },
    { source: "MERCH-001", target: "MERCH-002", relationship: "similar_risk", strength: 0.6 }
  ]
};
