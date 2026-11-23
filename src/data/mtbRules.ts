// MTB fraud rules from the Fraud BRD (Rule#1 – Rule#43), written in the rule
// builder's format. Field keys follow the backend FieldRegistry (ruleFields.ts).
//
// Conventions used throughout:
// - Amounts are BDT. Where the BRD gives only USD, it is converted at ~90 BDT/USD,
//   the rate the BRD itself implies (e.g. $500 = BDT 45,000). Each is noted in `gaps`.
// - "Approved and declined" means no status condition, so both are matched.
// - "Off-us" (acquiring) = isOnUsTransaction is No.
// - Countries are ISO alpha-2 codes (US, CN, BR …).
// - Logic follows ruleLogic.ts: items (single conditions or AND/OR groups) joined
//   by AND, OR or FOLLOWED_BY. In a FOLLOWED_BY rule each step after the first
//   has `within`, its time limit after the previous step.
// - transactionStatus values "Approved" / "Declined" are assumed (the registry
//   lists no fixed values for it).
// - Where the BRD needs a field the registry doesn't have, the rule is marked
//   `coverage: "partial"` and the missing part is listed in `gaps`.

import type { RuleCategory, RuleLibraryItem } from "./ruleManagementData";
import type { Condition, ConditionGroup, GroupMatch, Item, RuleLogic } from "./ruleLogic";

export type RuleBook = "Issuing" | "Acquiring";
export type RuleAction = "BLOCK" | "ALERT" | "CASE";

export interface RuleDefinition {
  id: string;
  /** The BRD rule number, e.g. "Rule#7" */
  brdRef: string;
  /** The BRD description, word for word */
  brdText: string;
  book: RuleBook;
  name: string;
  category: RuleCategory;
  description: string;
  scope: {
    network: string[];
    channel: string[];
    accessChannel: string[];
    transactionType: string[];
  };
  /** Items (conditions or groups) joined by AND, OR or FOLLOWED_BY */
  logic: RuleLogic;
  actions: RuleAction[];
  /** "partial" when part of the BRD rule can't be expressed with today's fields */
  coverage: "full" | "partial";
  gaps: string[];
}

/** BRD rules that need fields the registry doesn't have yet */
export interface UnsupportedRule {
  brdRef: string;
  brdText: string;
  missing: string;
}

// ---- helpers ---------------------------------------------------------------

let seq = 0;
const c = (field: string, operator: string, value: string, timeWindow?: string): Condition => ({
  id: `c${++seq}`,
  field,
  operator,
  value,
  ...(timeWindow ? { timeWindow } : {}),
});

/** A group of conditions joined by AND or OR */
const g = (match: GroupMatch, ...conditions: Condition[]): ConditionGroup => ({
  id: `g${++seq}`,
  kind: "group",
  match,
  conditions,
});

/** A FOLLOWED_BY step that must happen within `within` of the previous one */
const then = <T extends Item>(within: string, item: T): T => ({ ...item, within });

type Scope = Partial<RuleDefinition["scope"]>;
const scope = (s: Scope = {}): RuleDefinition["scope"] => ({
  network: s.network ?? [],
  channel: s.channel ?? [],
  accessChannel: s.accessChannel ?? [],
  transactionType: s.transactionType ?? [],
});

const offUs = () => c("isOnUsTransaction", "==", "false");
const foreign = () => c("isForeignTransaction", "==", "true");

const USD_NOTE = "USD threshold converted to BDT at ~90/USD; confirm the engine compares amounts in BDT";
const PER_CARD_NOTE = "Count/spend aggregates are per card over the window; confirm they only count transactions in the rule's scope";

// ---- rules -----------------------------------------------------------------

export const mtbRules: RuleDefinition[] = [
  // ===== Issuing =====
  {
    id: "MTB-01", brdRef: "Rule#1", book: "Issuing",
    brdText: "Megstripe transaction from Chip terminal from abroad",
    name: "Magstripe Fallback on Chip Terminal Abroad",
    category: "Geography",
    description: "Card swiped (magstripe) on a chip-capable terminal outside Bangladesh, a common sign of a cloned card.",
    scope: scope({ accessChannel: ["Magstripe"] }),
    logic: { operator: "AND", items: [c("terminalCapabilities", "CONTAINS", "Chip"), foreign()] },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: ["terminalCapabilities is free text; confirm the value the switch sends for chip-capable terminals"],
  },
  {
    id: "MTB-02", brdRef: "Rule#2", book: "Issuing",
    brdText: "Manual Key transaction from hybrid terminal",
    name: "Manual Key Entry on Hybrid Terminal",
    category: "Device",
    description: "Card number typed in by hand on a terminal that can read chip and magstripe.",
    scope: scope({ accessChannel: ["ManualKey"] }),
    logic: { operator: "AND", items: [c("terminalCapabilities", "CONTAINS", "Hybrid")] },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: ["terminalCapabilities is free text; confirm the value the switch sends for hybrid terminals"],
  },
  {
    id: "MTB-03", brdRef: "Rule#3", book: "Issuing",
    brdText: "Airline ecom transaction initiating from outside Bangladesh",
    name: "Foreign Airline E-commerce",
    category: "MCC",
    description: "Online airline ticket purchase made outside Bangladesh.",
    scope: scope({ channel: ["ECOM"] }),
    logic: { operator: "AND", items: [c("mcc", "IN", "4511, 3000, 3001, 3005, 3007, 3008, 3010, 3012, 3026"), c("country", "!=", "BD")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: ["Airline MCCs are 4511 plus the 3000–3350 range; extend the list with the carriers MTB cares about"],
  },
  {
    id: "MTB-04", brdRef: "Rule#4", book: "Issuing",
    brdText: "Card not present transaction with CVV2 result Code 'N'",
    name: "CNP with CVV2 Mismatch",
    category: "Behavior",
    description: "Card-not-present transaction where the CVV2 check failed (result code N).",
    scope: scope(),
    logic: { operator: "AND", items: [c("cardPresentYn", "==", "false"), c("isCvvCorrect", "==", "false")] },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-05", brdRef: "Rule#5", book: "Issuing",
    brdText: "For issuing ecom transaction if ECI=06 or UCAF collection indicator =1",
    name: "E-commerce Without Full 3-D Secure",
    category: "Network",
    description: "Online purchase that was only attempted, not fully authenticated, by 3-D Secure (ECI 06 or UCAF 1).",
    scope: scope({ channel: ["ECOM"] }),
    logic: { operator: "OR", items: [c("eci", "==", "06"), c("ucafIndicator", "==", "1")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-06", brdRef: "Rule#6", book: "Acquiring",
    brdText: "For payment gateway off-us transaction, If ECI =07 or UCAF collection indicator = 0 (USD=> 50",
    name: "Gateway Off-us Without 3-D Secure ≥ $50",
    category: "Network",
    description: "Off-us payment gateway transaction of $50 or more with no 3-D Secure (ECI 07) or no UCAF (indicator 0).",
    scope: scope({ channel: ["ECOM"] }),
    logic: {
      operator: "AND",
      items: [offUs(), c("amount", ">=", "4500"), g("OR", c("eci", "==", "07"), c("ucafIndicator", "==", "0"))],
    },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [USD_NOTE],
  },
  {
    id: "MTB-07", brdRef: "Rule#7", book: "Issuing",
    brdText: "POS transactions in any merchant amounting over and equal to 1,00,000 taka/$1100",
    name: "High-Value POS ≥ BDT 1,00,000",
    category: "Amount",
    description: "Single POS purchase of BDT 1,00,000 or more at any merchant.",
    scope: scope({ channel: ["POS"] }),
    logic: { operator: "AND", items: [c("amount", ">=", "100000")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-08", brdRef: "Rule#8", book: "Issuing",
    brdText: "Ecom transaction equal to and greater than 20,000 tk",
    name: "High-Value E-commerce ≥ BDT 20,000",
    category: "Amount",
    description: "Single online purchase of BDT 20,000 or more.",
    scope: scope({ channel: ["ECOM"] }),
    logic: { operator: "AND", items: [c("amount", ">=", "20000")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-09", brdRef: "Rule#9", book: "Issuing",
    brdText: "Cross border Pos approved and declined transaction over $200/ 17,000 taka",
    name: "Cross-Border POS > BDT 17,000",
    category: "Geography",
    description: "Approved or declined POS transaction abroad over BDT 17,000 ($200).",
    scope: scope({ channel: ["POS"] }),
    logic: { operator: "AND", items: [foreign(), c("amount", ">", "17000")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-10", brdRef: "Rule#10", book: "Issuing",
    brdText: "Cross border any ATM approve and declined transaction",
    name: "Any Cross-Border ATM",
    category: "Geography",
    description: "Every approved or declined ATM transaction made abroad.",
    scope: scope({ channel: ["ATM"] }),
    logic: { operator: "AND", items: [foreign()] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-11", brdRef: "Rule#11", book: "Acquiring",
    brdText: "Acquiring transaction over 50000 in mag stripe mode(F22=90)",
    name: "Acquiring Magstripe (F22=90) > BDT 50,000",
    category: "Amount",
    description: "Transaction at an MTB terminal over BDT 50,000 read by magstripe (POS entry mode 90).",
    scope: scope(),
    logic: { operator: "AND", items: [c("posEntryMode", "==", "90"), c("amount", ">", "50000")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: ["Same as Rule#34 except Rule#34 is limited to off-us cards; consider keeping one"],
  },
  {
    id: "MTB-12", brdRef: "Rule#12", book: "Issuing",
    brdText: "Multiple POS transaction by MTB card in a day amounting over 100000 tk\\USD 1176",
    name: "Daily POS Spend > BDT 1,00,000",
    category: "Velocity",
    description: "More than one POS transaction on the same card in a day, totalling over BDT 1,00,000.",
    scope: scope({ channel: ["POS"] }),
    logic: { operator: "AND", items: [c("transactionCount", ">=", "2", "1d"), c("posSpend", ">", "100000", "1d")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [PER_CARD_NOTE],
  },
  {
    id: "MTB-13", brdRef: "Rule#13", book: "Issuing",
    brdText: "Multiple ecom transaction by MTB card in a day amounting over 70,000 tk",
    name: "Daily E-commerce Spend > BDT 70,000",
    category: "Velocity",
    description: "More than one online transaction on the same card in a day, totalling over BDT 70,000.",
    scope: scope({ channel: ["ECOM"] }),
    logic: { operator: "AND", items: [c("transactionCount", ">=", "2", "1d"), c("ecomSpend", ">", "70000", "1d")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [PER_CARD_NOTE],
  },
  {
    id: "MTB-14", brdRef: "Rule#14", book: "Issuing",
    brdText: "Multiple any transaction in one MTB card in 30 minutes amounting over 50,000tk \\$580",
    name: "30-Minute Spend > BDT 50,000",
    category: "Velocity",
    description: "More than one transaction of any kind on the same card within 30 minutes, totalling over BDT 50,000.",
    scope: scope(),
    logic: { operator: "AND", items: [c("transactionCount", ">=", "2", "30m"), c("totalSpend", ">", "50000", "30m")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-15", brdRef: "Rule#15", book: "Issuing",
    brdText: "Multiple Approved and declined transaction in one MTB card in 30 minutes amounting over $500 \\BDT 45000",
    name: "30-Minute Approved + Declined > BDT 45,000",
    category: "Velocity",
    description: "More than one approved or declined transaction on the same card within 30 minutes, totalling over BDT 45,000.",
    scope: scope(),
    logic: { operator: "AND", items: [c("transactionCount", ">=", "2", "30m"), c("totalSpend", ">", "45000", "30m")] },
    actions: ["ALERT"],
    coverage: "partial",
    gaps: ["totalSpend may only add up approved debits; the BRD wants declined amounts counted too"],
  },
  {
    id: "MTB-16", brdRef: "Rule#16", book: "Issuing",
    brdText: "MCC is equal to \"6011\" , \"6012\" and 1st txn approved and 2 txn declined due to insufficient within 5 min",
    name: "Cash Approve-then-Decline Within 5 Min",
    category: "Velocity",
    description: "Cash/financial institution MCC (6011, 6012): an approved transaction followed by a declined one within 5 minutes.",
    scope: scope(),
    logic: {
      operator: "FOLLOWED_BY",
      items: [
        g("AND", c("mcc", "IN", "6011, 6012"), c("transactionStatus", "==", "Approved")),
        then("5m", g("AND", c("mcc", "IN", "6011, 6012"), c("transactionStatus", "==", "Declined"))),
      ],
    },
    actions: ["ALERT", "CASE"],
    coverage: "partial",
    gaps: ["No decline-reason field, so \"insufficient funds\" can't be checked; any decline matches"],
  },
  {
    id: "MTB-17", brdRef: "Rule#17", book: "Issuing",
    brdText: "POS Approved/declined txns>= BDT 8500 after any decline transaction from ATM due to invalid pin within 6 hour",
    name: "ATM Decline Then POS ≥ BDT 8,500 (6h)",
    category: "Behavior",
    description: "A declined ATM transaction followed within 6 hours by an approved or declined POS transaction of BDT 8,500 or more.",
    scope: scope(),
    logic: {
      operator: "FOLLOWED_BY",
      items: [
        g("AND", c("channel", "==", "ATM"), c("transactionStatus", "==", "Declined")),
        then("6h", g("AND", c("channel", "==", "POS"), c("amount", ">=", "8500"))),
      ],
    },
    actions: ["ALERT", "CASE"],
    coverage: "partial",
    gaps: ["No decline-reason field, so \"invalid PIN\" can't be checked; any ATM decline matches"],
  },
  {
    id: "MTB-18", brdRef: "Rule#18", book: "Issuing",
    brdText: "More than or equal to 5 local approved/ declined ATM txns within 5 min of amount BDT 80K",
    name: "5+ Local ATM in 5 Min Totalling BDT 80K",
    category: "Velocity",
    description: "Five or more local ATM transactions, approved or declined, within 5 minutes totalling BDT 80,000 or more.",
    scope: scope({ channel: ["ATM"] }),
    logic: { operator: "AND", items: [
      c("isForeignTransaction", "==", "false"),
      c("transactionCount", ">=", "5", "5m"),
      c("atmSpend", ">=", "80000", "5m"),
    ] },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: [PER_CARD_NOTE],
  },
  {
    id: "MTB-19", brdRef: "Rule#19", book: "Issuing",
    brdText: "Approved or declined Pos, ATM transactions from two different countries within 2 hours",
    name: "Local Then Abroad Within 2 Hours",
    category: "Geography",
    description: "POS or ATM transaction in Bangladesh followed within 2 hours by a POS or ATM transaction abroad (impossible travel).",
    scope: scope({ channel: ["POS", "ATM"] }),
    logic: {
      operator: "FOLLOWED_BY",
      items: [c("isForeignTransaction", "==", "false"), then("2h", foreign())],
    },
    actions: ["ALERT", "CASE"],
    coverage: "partial",
    gaps: [
      "No distinct-country count, so only Bangladesh → abroad is caught",
      "Abroad → Bangladesh and one foreign country → another are missed",
    ],
  },
  {
    id: "MTB-20", brdRef: "Rule#20", book: "Issuing",
    brdText: "Any online test transaction from any merchant name contains \"#\" followed by POS transaction",
    name: "Online Test Transaction (#) Then POS",
    category: "Behavior",
    description: "An online transaction at a merchant whose name contains \"#\" (card testing), followed by a POS transaction.",
    scope: scope(),
    logic: {
      operator: "FOLLOWED_BY",
      items: [
        g("AND", c("channel", "==", "ECOM"), c("merchantName", "CONTAINS", "#")),
        then("24h", c("channel", "==", "POS")),
      ],
    },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: ["BRD gives no time limit; 24 hours used"],
  },
  {
    id: "MTB-22", brdRef: "Rule#22", book: "Issuing",
    brdText: "Any approved/declined international Drug Store transaction FROM US MCC (5912,5122)",
    name: "US Drug Store Transaction",
    category: "MCC",
    description: "Approved or declined drug store / pharmaceutical transaction in the US.",
    scope: scope(),
    logic: { operator: "AND", items: [c("mcc", "IN", "5912, 5122"), c("country", "==", "US"), foreign()] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-23", brdRef: "Rule#23", book: "Issuing",
    brdText: "Any approved/declined international POS, online transaction from MCC 5311,5411,5422,5451,5462,5499,5944,5732 ,5812 & 5912",
    name: "International Retail MCC Watchlist",
    category: "MCC",
    description: "International POS or online transaction at watch-listed retail MCCs.",
    scope: scope({ channel: ["POS", "ECOM"] }),
    logic: { operator: "AND", items: [foreign(), c("mcc", "IN", "5311, 5411, 5422, 5451, 5462, 5499, 5944, 5732, 5812, 5912")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-24", brdRef: "Rule#24", book: "Issuing",
    brdText: "Approved/declined POS and ATM transaction from Country USA, GBR, ,Brazil,Spain,France,Portugal,Mexico,Russia,Negeria,south africa",
    name: "High-Risk Country POS/ATM",
    category: "Geography",
    description: "POS or ATM transaction in a watch-listed country.",
    scope: scope({ channel: ["POS", "ATM"] }),
    logic: { operator: "AND", items: [c("country", "IN", "US, GB, BR, ES, FR, PT, MX, RU, NG, ZA")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: ["Confirm the country code format the engine receives (alpha-2 assumed)"],
  },
  {
    id: "MTB-25", brdRef: "Rule#25", book: "Issuing",
    brdText: "Transaction from Brazil with transaction amount >= USD 50 from MCC:5813,5699",
    name: "Brazil Bars & Apparel ≥ $50",
    category: "Geography",
    description: "Transaction in Brazil of $50 or more at bars (5813) or apparel stores (5699).",
    scope: scope(),
    logic: { operator: "AND", items: [c("country", "==", "BR"), c("mcc", "IN", "5813, 5699"), c("amount", ">=", "4500")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [USD_NOTE],
  },
  {
    id: "MTB-26", brdRef: "Rule#26", book: "Issuing",
    brdText: "Decline card present txn (90,02) from credit/debit card expect ATM/CSH from South Asian countries with in 10 min followed by CNP.",
    name: "South Asia Declined Swipe Then CNP (10 Min)",
    category: "Behavior",
    description: "A declined magstripe card-present transaction (entry mode 90/02) on a credit or debit card in South Asia, not ATM or cash, followed by a card-not-present transaction within 10 minutes.",
    scope: scope(),
    logic: {
      operator: "FOLLOWED_BY",
      items: [
        g(
          "AND",
          c("posEntryMode", "IN", "90, 02"),
          c("transactionStatus", "==", "Declined"),
          c("cardType", "IN", "Credit, Debit"),
          c("channel", "!=", "ATM"),
          c("transactionType", "!=", "CashWithdrawal"),
          c("country", "IN", "IN, PK, LK, NP, BT, MV, AF"),
        ),
        then("10m", c("cardPresentYn", "==", "false")),
      ],
    },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: ["South Asia list leaves out Bangladesh (BD); add it if domestic declines should count"],
  },
  {
    id: "MTB-27", brdRef: "Rule#27", book: "Issuing",
    brdText: "CNP transactions from US Followed by card present transaction from CHINA(CN) within 30 minus",
    name: "US CNP Then China Card-Present (30 Min)",
    category: "Geography",
    description: "Card-not-present transaction in the US followed within 30 minutes by a card-present transaction in China.",
    scope: scope(),
    logic: {
      operator: "FOLLOWED_BY",
      items: [
        g("AND", c("country", "==", "US"), c("cardPresentYn", "==", "false")),
        then("30m", g("AND", c("country", "==", "CN"), c("cardPresentYn", "==", "true"))),
      ],
    },
    actions: ["ALERT", "CASE"],
    coverage: "full",
    gaps: [],
  },

  // ===== Acquiring (2nd phase) =====
  {
    id: "MTB-28", brdRef: "Rule#28", book: "Acquiring",
    brdText: "Multiple off-us transaction in single day by single card in MTB POS amounting over 80000 tk",
    name: "Off-us Daily POS Spend > BDT 80,000",
    category: "Velocity",
    description: "Several off-us transactions by one card at MTB POS in a day, totalling over BDT 80,000.",
    scope: scope({ channel: ["POS"] }),
    logic: { operator: "AND", items: [offUs(), c("transactionCount", ">=", "2", "1d"), c("posSpend", ">", "80000", "1d")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [PER_CARD_NOTE],
  },
  {
    id: "MTB-29", brdRef: "Rule#29", book: "Acquiring",
    brdText: "Multiple off-us transaction in 2 days by single foreign card in MTB POS amounting over BDT 1,00,000(txn currency local and billing currency foreign),E-8062",
    name: "Foreign Card 2-Day POS Spend > BDT 1,00,000",
    category: "Velocity",
    description: "Several off-us transactions by one foreign card at MTB POS over 2 days, totalling over BDT 1,00,000. Hospitals (MCC 8062) excluded.",
    scope: scope({ channel: ["POS"] }),
    logic: { operator: "AND", items: [
      offUs(),
      foreign(),
      c("mcc", "!=", "8062"),
      c("transactionCount", ">=", "2", "2d"),
      c("posSpend", ">", "100000", "2d"),
    ] },
    actions: ["ALERT"],
    coverage: "partial",
    gaps: ["No currency fields, so \"local txn currency, foreign billing currency\" is approximated with Foreign Transaction"],
  },
  {
    id: "MTB-30", brdRef: "Rule#30", book: "Acquiring",
    brdText: "Multiple off-us transaction in 3 days by single foreign card in MTB ATM amounting over BDT 1,00,000 (txn currency local and billing currency foreign),E-NPSB",
    name: "Foreign Card 3-Day ATM Spend > BDT 1,00,000",
    category: "Velocity",
    description: "Several off-us withdrawals by one foreign card at MTB ATMs over 3 days, totalling over BDT 1,00,000. NPSB excluded.",
    scope: scope({ channel: ["ATM"], network: ["VISA", "Mastercard", "AMEX", "UnionPay"] }),
    logic: { operator: "AND", items: [
      offUs(),
      foreign(),
      c("transactionCount", ">=", "2", "3d"),
      c("atmSpend", ">", "100000", "3d"),
    ] },
    actions: ["ALERT"],
    coverage: "partial",
    gaps: ["No currency fields, so \"local txn currency, foreign billing currency\" is approximated with Foreign Transaction"],
  },
  {
    id: "MTB-31", brdRef: "Rule#31", book: "Acquiring",
    brdText: "E-commerce off-us transaction equal to and greater than BDT10k",
    name: "Off-us E-commerce ≥ BDT 10,000",
    category: "Amount",
    description: "Off-us online transaction of BDT 10,000 or more through MTB's gateway.",
    scope: scope({ channel: ["ECOM"] }),
    logic: { operator: "AND", items: [offUs(), c("amount", ">=", "10000")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-32", brdRef: "Rule#32", book: "Acquiring",
    brdText: "More than 2 off-us transactions in same merchant in same card in a single day amounting over BDT20k",
    name: "Off-us Same Merchant 3+ Txns > BDT 20,000",
    category: "Velocity",
    description: "More than two off-us transactions by one card at the same merchant in a day, totalling over BDT 20,000.",
    scope: scope(),
    logic: { operator: "AND", items: [offUs(), c("transactionCount", ">", "2", "1d"), c("totalSpend", ">", "20000", "1d")] },
    actions: ["ALERT"],
    coverage: "partial",
    gaps: ["Aggregates are per card, not per card + merchant"],
  },
  {
    id: "MTB-33", brdRef: "Rule#33", book: "Acquiring",
    brdText: "If any manual key entry off-us transaction found from any MTB merchant then alert will be generated",
    name: "Off-us Manual Key Entry",
    category: "Device",
    description: "Any off-us transaction keyed in by hand at an MTB merchant.",
    scope: scope({ accessChannel: ["ManualKey"] }),
    logic: { operator: "AND", items: [offUs()] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-34", brdRef: "Rule#34", book: "Acquiring",
    brdText: "Acquiring transaction over BDT 50000 in mag stripe mode(F22=90)",
    name: "Off-us Magstripe (F22=90) > BDT 50,000",
    category: "Amount",
    description: "Off-us transaction at an MTB terminal over BDT 50,000 read by magstripe (POS entry mode 90).",
    scope: scope(),
    logic: { operator: "AND", items: [offUs(), c("posEntryMode", "==", "90"), c("amount", ">", "50000")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: ["Near-duplicate of Rule#11"],
  },
  {
    id: "MTB-35", brdRef: "Rule#35", book: "Acquiring",
    brdText: "For Acquiring ecom transaction if ECI=06 or UCAF collection indicator =1",
    name: "Acquiring E-commerce Without Full 3-D Secure",
    category: "Network",
    description: "Off-us online transaction with only attempted 3-D Secure (ECI 06) or UCAF indicator 1.",
    scope: scope({ channel: ["ECOM"] }),
    logic: {
      operator: "AND",
      items: [offUs(), g("OR", c("eci", "==", "06"), c("ucafIndicator", "==", "1"))],
    },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-36", brdRef: "Rule#36", book: "Acquiring",
    brdText: "Single off-us transaction in MTB POS amounting over 50000 tk exclude MCC 6011,8062 and include all approved and declined transaction",
    name: "Off-us POS > BDT 50,000",
    category: "Amount",
    description: "Single approved or declined off-us POS transaction over BDT 50,000, excluding cash (6011) and hospitals (8062).",
    scope: scope({ channel: ["POS"] }),
    logic: { operator: "AND", items: [offUs(), c("amount", ">", "50000"), c("mcc", "NOT_IN", "6011, 8062")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },
  {
    id: "MTB-37", brdRef: "Rule#37", book: "Acquiring",
    brdText: "Specific MCC Transactions Monitoring(4829,7995,9754,7800,7801,7802,6050,6051, 6012) only international",
    name: "International High-Risk MCC",
    category: "MCC",
    description: "International transaction at money transfer, gambling, lottery or quasi-cash MCCs.",
    scope: scope(),
    logic: { operator: "AND", items: [foreign(), c("mcc", "IN", "4829, 7995, 9754, 7800, 7801, 7802, 6050, 6051, 6012")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [],
  },

  // ===== Others =====
  {
    id: "MTB-39", brdRef: "Rule#39", book: "Issuing",
    brdText: "Multiple e Commerce foreign transactions (approved/declined) by MTB card count =>4, Amount => $25/BDT 2300 , occurred within 30 minutes, then alert will be generate in ADC fraud monitoring tool",
    name: "4+ Foreign E-commerce in 30 Min",
    category: "Velocity",
    description: "Four or more foreign online transactions, approved or declined, of BDT 2,300 or more each, within 30 minutes.",
    scope: scope({ channel: ["ECOM"] }),
    logic: { operator: "AND", items: [foreign(), c("amount", ">=", "2300"), c("transactionCount", ">=", "4", "30m")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: [PER_CARD_NOTE],
  },
  {
    id: "MTB-40", brdRef: "Rule#40", book: "Issuing",
    brdText: "Cash by Code ATM transaction",
    name: "Cash-by-Code ATM Withdrawal",
    category: "Behavior",
    description: "Cardless (cash-by-code) withdrawal at an ATM.",
    scope: scope({ channel: ["ATM"], transactionType: ["CashWithdrawal"] }),
    logic: { operator: "AND", items: [c("accessChannel", "==", "Cardless")] },
    actions: ["ALERT"],
    coverage: "full",
    gaps: ["Assumes cash-by-code arrives as access channel Cardless"],
  },
  {
    id: "MTB-41", brdRef: "Rule#41", book: "Issuing",
    brdText: "If there will be more than 2 transactions within 12 hours in Facebook from a single card",
    name: "3+ Facebook Transactions in 12 Hours",
    category: "Velocity",
    description: "More than two transactions on the same card within 12 hours where the merchant is Facebook.",
    scope: scope(),
    logic: { operator: "AND", items: [c("merchantName", "CONTAINS", "FACEBK"), c("transactionCount", ">", "2", "12h")] },
    actions: ["ALERT"],
    coverage: "partial",
    gaps: [
      "transactionCount counts all of the card's transactions, not only Facebook ones",
      "Facebook usually appears as \"FACEBK\" in the merchant name; confirm with real data",
    ],
  },
];

/** BRD rules that can't be built until the registry gets new fields */
export const unsupportedMtbRules: UnsupportedRule[] = [
  {
    brdRef: "Rule#21",
    brdText: "All approved transactions from STIP",
    missing: "A stand-in (STIP) flag or authorizer field",
  },
  {
    brdRef: "Rule#38",
    brdText: "Real Time decline (RTD) in MFS Transactions",
    missing: "Which MFS transactions to decline isn't stated; needs the criteria from the BRD owner",
  },
  {
    brdRef: "Rule#42",
    brdText: "Multiple reversal transactions (approved/declined) by single MTB card count =>5, occurred within 24 hours",
    missing: "A Reversal transaction type (or reversal count aggregate)",
  },
  {
    brdRef: "Rule#43",
    brdText: "Multiple reversal transactions (approved/declined) by single MTB card count >10, occurred within 7 days",
    missing: "A Reversal transaction type (or reversal count aggregate)",
  },
];

export function getMtbRule(id?: string): RuleDefinition | undefined {
  return mtbRules.find((r) => r.id === id);
}

// ---- Rule Library rows -----------------------------------------------------

const libraryChannel: Record<string, string> = {
  ECOM: "Online",
  MOTO: "Online",
  POS: "POS",
  ATM: "ATM",
  MFS: "Mobile",
};

export const mtbLibraryItems: RuleLibraryItem[] = mtbRules.map((r) => ({
  id: r.id,
  name: r.name,
  category: r.category,
  status: "SANDBOX",
  hits: 0,
  blocks: 0,
  falsePositiveRate: 0,
  lastModified: "2026-11-14 00:00",
  channels: r.scope.channel.length
    ? [...new Set(r.scope.channel.map((ch) => libraryChannel[ch] ?? ch))]
    : ["Online", "POS", "ATM", "Mobile"],
  description: `${r.brdRef}: ${r.description}`,
}));
