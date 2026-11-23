// Rule condition fields. Source of truth: the backend FieldRegistry
// (com.konasl.fds.model.FieldRegistry). `key` is the JSON field name the
// registry looks up, so it must match exactly. `label` is what users see.
// Left out on purpose: ipAddress, status, and the countryCode alias of country.

export type RuleFieldDataType = "Double" | "Integer" | "String" | "Boolean";
export type RuleFieldGroup = "Transaction" | "Custom";

export interface RuleField {
  key: string;
  label: string;
  dataType: RuleFieldDataType;
  group: RuleFieldGroup;
  /** Known values, shown as a dropdown when comparing with == or != */
  options?: string[];
  /** Registry twRequired: aggregated over a sliding window, so a time window is required */
  needsTimeWindow?: boolean;
}

export const ruleFields: RuleField[] = [
  // Transaction fields
  { key: "amount", label: "Amount", dataType: "Double", group: "Transaction" },
  { key: "country", label: "Country", dataType: "String", group: "Transaction" },
  { key: "mcc", label: "Merchant Category (MCC)", dataType: "String", group: "Transaction" },
  { key: "deviceId", label: "Device ID", dataType: "String", group: "Transaction" },
  {
    key: "transactionType",
    label: "Transaction Type",
    dataType: "String",
    group: "Transaction",
    options: [
      "Purchase", "CashWithdrawal", "BalanceInquiry", "PreAuth", "PreAuthCompletion",
      "OriginalCredit", "FundTransfer", "AccountVerification", "PinChange", "PinVerify",
      "MiniStatement", "QRPayment",
    ],
  },
  { key: "merchantName", label: "Merchant Name", dataType: "String", group: "Transaction" },
  {
    key: "cardStatus",
    label: "Card Status",
    dataType: "String",
    group: "Transaction",
    options: ["Active", "Lost", "Closed", "Stolen"],
  },
  {
    key: "channel",
    label: "Channel",
    dataType: "String",
    group: "Transaction",
    options: ["ATM", "POS", "ECOM", "MOTO", "MFS"],
  },
  {
    key: "accessChannel",
    label: "Access Channel",
    dataType: "String",
    group: "Transaction",
    options: [
      "ChipContact", "Contactless", "Magstripe", "ManualKey", "Cardless",
      "Tokenized", "CredentialOnFile", "QR",
    ],
  },
  { key: "terminalId", label: "Terminal ID", dataType: "String", group: "Transaction" },
  // The registry maps cardNumber to cardId (PAN)
  { key: "cardNumber", label: "Card Number", dataType: "String", group: "Transaction" },
  { key: "isOnUsTransaction", label: "On-Us Transaction", dataType: "Boolean", group: "Transaction" },
  { key: "posEntryMode", label: "POS Entry Mode", dataType: "String", group: "Transaction" },
  { key: "isCvvCorrect", label: "CVV Correct", dataType: "Boolean", group: "Transaction" },
  {
    key: "cardType",
    label: "Card Type",
    dataType: "String",
    group: "Transaction",
    options: ["Credit", "Debit", "Prepaid"],
  },
  { key: "isForeignTransaction", label: "Foreign Transaction", dataType: "Boolean", group: "Transaction" },
  { key: "transactionStatus", label: "Transaction Status", dataType: "String", group: "Transaction" },
  { key: "cardPresentYn", label: "Card Present", dataType: "Boolean", group: "Transaction" },
  { key: "credentialOnFileYn", label: "Card Saved on File", dataType: "Boolean", group: "Transaction" },
  { key: "tokenizedYn", label: "Tokenized Card", dataType: "Boolean", group: "Transaction" },
  { key: "eci", label: "E-commerce Indicator (ECI)", dataType: "String", group: "Transaction" },
  { key: "ucafIndicator", label: "UCAF Indicator", dataType: "String", group: "Transaction", options: ["0", "1"] },
  { key: "terminalCapabilities", label: "Terminal Capabilities", dataType: "String", group: "Transaction" },
  {
    key: "merchantCategoryRisk",
    label: "Merchant Risk Level",
    dataType: "String",
    group: "Transaction",
    options: ["Low", "Medium", "High"],
  },
  { key: "entryType", label: "Debit or Credit", dataType: "String", group: "Transaction", options: ["DEBIT", "CREDIT"] },

  // Custom / aggregate fields
  { key: "transactionCount", label: "Number of Transactions", dataType: "Integer", group: "Custom", needsTimeWindow: true },
  { key: "declinedCount", label: "Number of Declines", dataType: "Integer", group: "Custom", needsTimeWindow: true },
  { key: "averageDailySpend", label: "Average Daily Spend", dataType: "Double", group: "Custom" },
  { key: "merchantHistory", label: "Used This Merchant Before", dataType: "Boolean", group: "Custom" },
  { key: "dailyTotalSpend", label: "Today's Total Spend", dataType: "Double", group: "Custom" },
  // Total DEBIT amount (money out)
  { key: "totalSpend", label: "Total Spend", dataType: "Double", group: "Custom", needsTimeWindow: true },
  // Total CREDIT / refund amount (money in)
  { key: "creditAmount", label: "Total Credits & Refunds", dataType: "Double", group: "Custom", needsTimeWindow: true },
  // Channel-specific spend (DEBIT only)
  { key: "atmSpend", label: "ATM Spend", dataType: "Double", group: "Custom", needsTimeWindow: true },
  { key: "posSpend", label: "POS Spend", dataType: "Double", group: "Custom", needsTimeWindow: true },
  { key: "ecomSpend", label: "Online Spend", dataType: "Double", group: "Custom", needsTimeWindow: true },
  { key: "motoSpend", label: "Mail & Phone Order Spend", dataType: "Double", group: "Custom", needsTimeWindow: true },
  { key: "mfsSpend", label: "Mobile Wallet (MFS) Spend", dataType: "Double", group: "Custom", needsTimeWindow: true },
];

export const ruleFieldGroups: RuleFieldGroup[] = ["Transaction", "Custom"];

export const groupLabels: Record<RuleFieldGroup, string> = {
  Transaction: "Transaction Details",
  Custom: "Activity & Spending",
};

export const dataTypeLabels: Record<RuleFieldDataType, string> = {
  Double: "Number",
  Integer: "Count",
  String: "Text",
  Boolean: "Yes / No",
};

export const operatorsByType: Record<RuleFieldDataType, string[]> = {
  Double: [">", ">=", "<", "<=", "==", "!="],
  Integer: [">", ">=", "<", "<=", "==", "!="],
  String: ["==", "!=", "IN", "NOT_IN", "CONTAINS"],
  Boolean: ["==", "!="],
};

/** What users see for each operator; the rule JSON keeps the symbol */
export const operatorLabels: Record<string, string> = {
  ">": "is more than",
  ">=": "is at least",
  "<": "is less than",
  "<=": "is at most",
  "==": "is",
  "!=": "is not",
  IN: "is any of",
  NOT_IN: "is none of",
  CONTAINS: "contains",
};

export function getRuleField(key: string): RuleField | undefined {
  return ruleFields.find((f) => f.key === key);
}

export function fieldLabel(key: string): string {
  return getRuleField(key)?.label ?? key;
}

// ---- Time windows ----------------------------------------------------------
// A window is any length in minutes, hours or days, stored as e.g. "45m", "2h", "3d".

export type TimeUnit = "m" | "h" | "d";

export const timeUnits: { value: TimeUnit; label: string }[] = [
  { value: "m", label: "mins" },
  { value: "h", label: "hours" },
  { value: "d", label: "days" },
];

/** Quick picks only; any other length can be typed */
export const timeWindowPresets = ["1m", "5m", "10m", "30m", "1h", "24h", "7d"];

export const DEFAULT_TIME_WINDOW = "5m";

export function parseTimeWindow(tw?: string): { amount: string; unit: TimeUnit } {
  const match = /^(\d*)([mhd])$/.exec(tw ?? "");
  if (!match) return { amount: "", unit: "m" };
  return { amount: match[1], unit: match[2] as TimeUnit };
}

export function formatTimeWindow(amount: string, unit: TimeUnit): string {
  return `${amount.replace(/\D/g, "")}${unit}`;
}

export function describeTimeWindow(tw?: string): string {
  const { amount, unit } = parseTimeWindow(tw);
  if (!amount) return "";
  const n = Number(amount);
  const word = { m: "minute", h: "hour", d: "day" }[unit];
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** A valid starting operator, value and time window for a field */
export function defaultsForField(key: string) {
  const field = getRuleField(key);
  if (!field) return { operator: "==", value: "", timeWindow: undefined as string | undefined };
  const operator = operatorsByType[field.dataType][0];
  let value = "";
  if (field.dataType === "Boolean") value = "true";
  else if (field.dataType === "Double" || field.dataType === "Integer") value = "0";
  else if (field.options) value = field.options[0];
  return { operator, value, timeWindow: field.needsTimeWindow ? DEFAULT_TIME_WINDOW : undefined };
}
