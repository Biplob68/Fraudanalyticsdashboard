// Rule logic: a list of items joined by one operator.
//
// - The operator is AND, OR or FOLLOWED_BY.
// - Each item is a single condition or a group. A group has its own AND / OR
//   for the conditions inside it.
// - With FOLLOWED_BY the items happen in order: each item after the first must
//   happen within its own time limit (`within`) after the item before it.

export type Operator = "AND" | "OR" | "FOLLOWED_BY";
export type GroupMatch = "AND" | "OR";

export interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  timeWindow?: string;
  /** FOLLOWED_BY only: time limit after the previous item */
  within?: string;
}

export interface ConditionGroup {
  id: string;
  kind: "group";
  match: GroupMatch;
  conditions: Condition[];
  /** FOLLOWED_BY only: time limit after the previous item */
  within?: string;
}

/** One item of a rule: a single condition or a group of conditions */
export type Item = Condition | ConditionGroup;

export interface RuleLogic {
  operator: Operator;
  items: Item[];
}

export const DEFAULT_WITHIN = "10m";

export const isGroup = (item: Item): item is ConditionGroup => (item as ConditionGroup).kind === "group";

let counter = 0;
export const newLogicId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

/** Number of conditions, counting those inside groups */
export const countConditions = (items: Item[]) =>
  items.reduce((n, i) => n + (isGroup(i) ? i.conditions.length : 1), 0);

/** Every item after the first gets a time limit when the rule is FOLLOWED_BY */
export function withTimeLimits(logic: RuleLogic): RuleLogic {
  if (logic.operator !== "FOLLOWED_BY") return logic;
  return {
    ...logic,
    items: logic.items.map((item, i) => (i > 0 && !item.within ? { ...item, within: DEFAULT_WITHIN } : item)),
  };
}

// ---- Plain-language text -------------------------------------------------------

const word = (m: GroupMatch) => (m === "AND" ? "and" : "or");

export function logicSentence(
  logic: RuleLogic,
  describe: (c: Condition) => string,
  describeWindow: (w?: string) => string
): string {
  const itemText = (item: Item) => {
    if (!isGroup(item)) return describe(item);
    if (item.conditions.length === 0) return "(empty group)";
    const inner = item.conditions.map(describe).join(` ${word(item.match)} `);
    return logic.items.length > 1 && item.conditions.length > 1 ? `(${inner})` : inner;
  };

  if (logic.operator === "FOLLOWED_BY") {
    return logic.items
      .map((item, i) => (i === 0 ? itemText(item) : `then within ${describeWindow(item.within) || "?"} ${itemText(item)}`))
      .join(", ");
  }
  return logic.items.map(itemText).join(` ${word(logic.operator)} `);
}

// ---- Rule JSON ---------------------------------------------------------------

const conditionNode = (c: Condition) => ({
  type: "simple",
  field: c.field,
  operator: c.operator,
  value: c.value,
  ...(c.timeWindow ? { time_window: c.timeWindow } : {}),
});

/**
 * A plain AND / OR list without groups keeps the engine's flat shape
 * (`logicalOperator` + `conditions`). Anything else is written as a tree.
 */
export function logicJson(logic: RuleLogic) {
  const sequence = logic.operator === "FOLLOWED_BY";
  if (!sequence && !logic.items.some(isGroup)) {
    return { logicalOperator: logic.operator, conditions: (logic.items as Condition[]).map(conditionNode) };
  }
  return {
    logic: {
      operator: logic.operator,
      items: logic.items.map((item, i) => {
        const within = sequence && i > 0 ? { within: item.within } : {};
        return isGroup(item)
          ? { ...within, operator: item.match, items: item.conditions.map(conditionNode) }
          : { ...within, ...conditionNode(item) };
      }),
    },
  };
}
