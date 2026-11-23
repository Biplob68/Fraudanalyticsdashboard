import { useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import { Save, Play, Plus, Trash2, FileText, Code, Check } from "lucide-react";
import { ruleLibraryItems } from "../data/ruleManagementData";
import { getMtbRule } from "../data/mtbRules";
import {
  ruleFields,
  ruleFieldGroups,
  operatorsByType,
  operatorLabels,
  groupLabels,
  timeUnits,
  parseTimeWindow,
  formatTimeWindow,
  describeTimeWindow,
  getRuleField,
  fieldLabel,
  defaultsForField,
  type TimeUnit,
} from "../data/ruleFields";
import {
  type Condition,
  type ConditionGroup,
  type GroupMatch,
  type Item,
  type Operator,
  type RuleLogic,
  DEFAULT_WITHIN,
  isGroup,
  newLogicId,
  withTimeLimits,
  logicSentence,
  logicJson,
} from "../data/ruleLogic";
import "../styles/ruleBuilder.css";
import { ChecklistDropdown } from "../components/ChecklistDropdown";

type ActionType = "BLOCK" | "ALERT" | "CASE";

// Shared look for every input in a condition row
const controlClass =
  "rb-control w-full px-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";

// Basics inputs: same height, a little more padding
const basicInputClass =
  "rb-control w-full px-3 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";

// Scope values come from the same lists as the condition fields
const scopeOptions = {
  network: ["VISA", "Mastercard", "AMEX", "UnionPay", "NPSB"],
  channel: getRuleField("channel")?.options ?? [],
  accessChannel: getRuleField("accessChannel")?.options ?? [],
  transactionType: getRuleField("transactionType")?.options ?? [],
};

/** Rule JSON value for a scope: "ANY" when nothing specific is picked */
const scopeValue = (selected: string[]) => (selected.length === 0 ? "ANY" : selected);

/** Plain-language scope for the summary sentence */
const scopeText = (selected: string[], allText: string) =>
  selected.length === 0 ? allText : selected.join(" or ");

// How the items of a rule combine
const operators: { value: Operator; label: string; hint: string }[] = [
  { value: "AND", label: "All", hint: "every item must match" },
  { value: "OR", label: "Any", hint: "one item is enough" },
  { value: "FOLLOWED_BY", label: "In order", hint: "items happen one after another" },
];

// Actions, in the order they're shown. `json` is the name the rule engine uses.
const actionOptions: { value: ActionType; json: string; label: string; hint: string; pill: string }[] = [
  { value: "BLOCK", json: "Block", label: "Block", hint: "Stop the transaction", pill: "bg-red-100 text-red-700" },
  { value: "ALERT", json: "Alert", label: "Alert", hint: "Notify the fraud team", pill: "bg-yellow-100 text-yellow-700" },
  { value: "CASE", json: "Case", label: "Case", hint: "Open a case for review", pill: "bg-blue-100 text-blue-700" },
];

const categories = ["Velocity", "Geography", "MCC", "Amount", "Device", "Network", "Behavior"];

const newCondition = (): Condition => ({ id: newLogicId("c"), field: "amount", operator: ">", value: "1000" });

/** Edit operations on one list of conditions */
interface ListOps {
  update: (id: string, updates: Partial<Condition>) => void;
  remove: (id: string) => void;
  add: () => void;
}

/**
 * A numbered card for one part of the rule. `inline` puts the content on the
 * same line as the title, for short sections like Actions.
 */
function Section({
  number,
  title,
  hint,
  inline,
  children,
}: {
  number: number;
  title: string;
  hint?: ReactNode;
  inline?: boolean;
  children: ReactNode;
}) {
  const heading = (
    <>
      <span
        className="rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center flex-shrink-0"
        style={{ width: 24, height: 24 }}
        aria-hidden="true"
      >
        {number}
      </span>
      <h3 id={`rule-section-${number}`} className="font-semibold text-gray-900">
        {title}
      </h3>
    </>
  );

  if (inline) {
    return (
      <section className="bg-white border border-gray-200 rounded-lg px-5 py-3" aria-labelledby={`rule-section-${number}`}>
        <div className="flex flex-wrap items-center gap-3">
          {heading}
          <div className="flex flex-wrap items-center gap-2" style={{ marginLeft: 12 }}>
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5" aria-labelledby={`rule-section-${number}`}>
      <div className="flex items-center gap-3 mb-4">
        {heading}
        {hint && <div className="text-xs text-gray-500" style={{ marginLeft: "auto" }}>{hint}</div>}
      </div>
      {children}
    </section>
  );
}

export function RuleBuilder() {
  const { ruleId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(ruleId);

  // Find existing rule if editing
  const existingRule = isEditMode ? ruleLibraryItems.find(r => r.id === ruleId) : null;

  const [ruleName, setRuleName] = useState(existingRule?.name || "");
  const [category, setCategory] = useState(existingRule?.category || "Velocity");
  const [description, setDescription] = useState(existingRule?.description || "");
  // Full definition for rules from the MTB Fraud BRD, so editing loads its logic
  const mtbRule = getMtbRule(ruleId);

  // The rule: items (single conditions or groups) joined by AND, OR or FOLLOWED_BY
  const [logic, setLogicRaw] = useState<RuleLogic>(() =>
    withTimeLimits(
      mtbRule
        ? structuredClone(mtbRule.logic)
        : {
            operator: "AND",
            items: [{ id: newLogicId("c"), field: "transactionCount", operator: ">", value: "5", timeWindow: "1m" }],
          }
    )
  );
  const setLogic = (update: (l: RuleLogic) => RuleLogic) => setLogicRaw((l) => withTimeLimits(update(l)));

  const [actions, setActions] = useState<ActionType[]>(mtbRule?.actions ?? ["BLOCK"]);

  // Rule scope: an empty list means the rule applies to all values
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(mtbRule?.scope.network ?? []);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(mtbRule?.scope.channel ?? []);
  const [selectedAccessChannels, setSelectedAccessChannels] = useState<string[]>(mtbRule?.scope.accessChannel ?? []);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>(mtbRule?.scope.transactionType ?? []);

  // View JSON modal state
  const [showJsonModal, setShowJsonModal] = useState(false);

  const isSequence = logic.operator === "FOLLOWED_BY";

  // ---- Edit operations ------------------------------------------------------

  const setItems = (update: (items: Item[]) => Item[]) => setLogic((l) => ({ ...l, items: update(l.items) }));

  const updateItem = (id: string, updates: Partial<Condition & ConditionGroup>) =>
    setItems((items) => items.map((i) => (i.id === id ? ({ ...i, ...updates } as Item) : i)));

  const removeItem = (id: string) => setItems((items) => items.filter((i) => i.id !== id));

  // A single condition is its own item; its ops act on the item list
  const singleOps: ListOps = {
    update: (id, updates) => updateItem(id, updates),
    remove: removeItem,
    add: () => setItems((items) => [...items, newCondition()]),
  };

  // Conditions inside a group
  const groupOps = (groupId: string): ListOps => {
    const setConditions = (update: (cs: Condition[]) => Condition[]) =>
      setItems((items) =>
        items.map((i) => (isGroup(i) && i.id === groupId ? { ...i, conditions: update(i.conditions) } : i))
      );
    return {
      update: (id, updates) => setConditions((cs) => cs.map((c) => (c.id === id ? { ...c, ...updates } : c))),
      remove: (id) => setConditions((cs) => cs.filter((c) => c.id !== id)),
      add: () => setConditions((cs) => [...cs, newCondition()]),
    };
  };

  const addGroup = () =>
    setItems((items) => [
      ...items,
      { id: newLogicId("g"), kind: "group", match: "OR", conditions: [newCondition(), newCondition()] } as ConditionGroup,
    ]);

  // Keep actions in their display order
  const toggleAction = (action: ActionType) => {
    setActions((current) =>
      actionOptions
        .map((a) => a.value)
        .filter((a) => (a === action ? !current.includes(a) : current.includes(a)))
    );
  };

  // Shows Yes/No for true/false fields in summaries
  const formatValue = (c: Condition) =>
    getRuleField(c.field)?.dataType === "Boolean" ? (c.value === "true" ? "Yes" : "No") : c.value;

  const conditionSentence = (c: Condition) => {
    const window = describeTimeWindow(c.timeWindow);
    const timeText = window ? ` within ${window}` : "";
    return `${fieldLabel(c.field)} ${operatorLabels[c.operator] ?? c.operator} ${formatValue(c)}${timeText}`;
  };

  const readsAs = logic.items.length ? logicSentence(logic, conditionSentence, describeTimeWindow) : "no conditions yet";

  // ---- Rendering helpers ------------------------------------------------------

  const renderValueInput = (condition: Condition, ops: ListOps) => {
    const field = getRuleField(condition.field);
    const isEquality = condition.operator === "==" || condition.operator === "!=";
    const setValue = (value: string) => ops.update(condition.id, { value });

    if (field?.dataType === "Boolean") {
      return (
        <select value={condition.value} onChange={(e) => setValue(e.target.value)} className={controlClass} aria-label="Value">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (field?.options && isEquality) {
      return (
        <select value={condition.value} onChange={(e) => setValue(e.target.value)} className={controlClass} aria-label="Value">
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    const isNumber = field?.dataType === "Double" || field?.dataType === "Integer";
    let placeholder = "value";
    if (condition.operator === "IN" || condition.operator === "NOT_IN") {
      placeholder = field?.options
        ? `e.g. ${field.options.slice(0, 2).join(", ")}`
        : "comma-separated, e.g. 7995, 4829";
    }

    return (
      <input
        type={isNumber ? "number" : "text"}
        step={field?.dataType === "Integer" ? 1 : "any"}
        value={condition.value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={controlClass}
        aria-label="Value"
      />
    );
  };

  /** One condition row: field · condition · value · time window · remove */
  const renderRow = (condition: Condition, ops: ListOps, label: string) => {
    const field = getRuleField(condition.field);
    const tw = parseTimeWindow(condition.timeWindow);
    const twValid = Number(tw.amount) > 0;
    const setTw = (part: { amount?: string; unit?: TimeUnit }) =>
      ops.update(condition.id, { timeWindow: formatTimeWindow(part.amount ?? tw.amount, part.unit ?? tw.unit) });

    return (
      <div key={condition.id} className="rb-cond-row">
        <select
          value={condition.field}
          onChange={(e) => ops.update(condition.id, { field: e.target.value, ...defaultsForField(e.target.value) })}
          className={controlClass}
          aria-label={`Field for ${label}`}
        >
          {ruleFieldGroups.map((fg) => (
            <optgroup key={fg} label={groupLabels[fg]}>
              {ruleFields
                .filter((f) => f.group === fg)
                .map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
            </optgroup>
          ))}
        </select>

        <select
          value={condition.operator}
          onChange={(e) => ops.update(condition.id, { operator: e.target.value })}
          className={controlClass}
          aria-label={`Condition for ${label}`}
        >
          {operatorsByType[field?.dataType ?? "String"].map((op) => (
            <option key={op} value={op}>{operatorLabels[op] ?? op}</option>
          ))}
        </select>

        <div>{renderValueInput(condition, ops)}</div>

        {/* Time window: any length, only for fields that need it */}
        {field?.needsTimeWindow ? (
          <div
            className="rb-time"
            title={twValid ? `Within the last ${describeTimeWindow(condition.timeWindow)}` : "Enter a time window of at least 1"}
          >
            <input
              type="number"
              min={1}
              step={1}
              value={tw.amount}
              onChange={(e) => setTw({ amount: e.target.value })}
              className={`rb-control w-full px-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                twValid ? "border-gray-300 bg-white" : "border-red-300 bg-red-50"
              }`}
              aria-label={`Time window length for ${label}`}
              aria-invalid={!twValid}
            />
            <select
              value={tw.unit}
              onChange={(e) => setTw({ unit: e.target.value as TimeUnit })}
              className="rb-control w-full px-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              aria-label={`Time window unit for ${label}`}
            >
              {timeUnits.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => ops.remove(condition.id)}
          className="rb-del p-1.5 rounded-md text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors"
          title="Remove condition"
          aria-label={`Remove ${label}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const addLink = (onClick: () => void, text: string) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
    >
      <Plus className="h-4 w-4" />
      {text}
    </button>
  );

  /** "then within …" row between items of an in-order rule. All / Any need no row: the switch says it */
  const renderConnector = (item: Item, index: number) => {
    if (!isSequence) return null;
    const w = parseTimeWindow(item.within ?? DEFAULT_WITHIN);
    const valid = Number(w.amount) > 0;
    const setWithin = (part: { amount?: string; unit?: TimeUnit }) =>
      updateItem(item.id, { within: formatTimeWindow(part.amount ?? w.amount, part.unit ?? w.unit) });
    return (
      <div className="rb-tr rb-link-row rb-link-then">
        then within
        <input
          type="number"
          min={1}
          step={1}
          value={w.amount}
          onChange={(e) => setWithin({ amount: e.target.value })}
          className={`border rounded text-xs text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 ${
            valid ? "border-gray-300 bg-white" : "border-red-300 bg-red-50"
          }`}
          style={{ width: 40, height: 22, padding: "0 2px" }}
          aria-label={`Time limit before item ${index + 1}`}
          aria-invalid={!valid}
        />
        <select
          value={w.unit}
          onChange={(e) => setWithin({ unit: e.target.value as TimeUnit })}
          className="border border-gray-300 rounded bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          style={{ height: 22, padding: "0 2px" }}
          aria-label={`Time limit unit before item ${index + 1}`}
        >
          {timeUnits.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
    );
  };

  /** One item as table rows: a single condition row, or a group header row plus its rows */
  const renderItem = (item: Item, index: number) => {
    if (!isGroup(item)) {
      return <div className="rb-tr">{renderRow(item, singleOps, `item ${index + 1}`)}</div>;
    }
    const ops = groupOps(item.id);
    return (
      <>
        <div className="rb-tr rb-group-head">
          <span>Group ·</span>
          <select
            value={item.match}
            onChange={(e) => updateItem(item.id, { match: e.target.value as GroupMatch })}
            className="rb-inline-select"
            aria-label={`Item ${index + 1}: all or any of the group`}
          >
            <option value="AND">all</option>
            <option value="OR">any</option>
          </select>
          <span>of these</span>
          <div className="flex items-center gap-1" style={{ marginLeft: "auto" }}>
            {addLink(ops.add, "Add")}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rb-del p-1.5 rounded-md text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Remove group"
              aria-label={`Remove group ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {item.conditions.length === 0 ? (
          <div className="rb-tr rb-in-group text-sm text-gray-500">No conditions in this group yet.</div>
        ) : (
          item.conditions.map((c, ci) => (
            <div key={c.id} className="rb-tr rb-in-group">
              {renderRow(c, ops, `item ${index + 1} condition ${ci + 1}`)}
            </div>
          ))
        )}
      </>
    );
  };

  const handleSaveToSandbox = () => {
    alert(`Rule "${ruleName}" saved to Sandbox for testing`);
  };

  const handleRunSimulation = () => {
    navigate(`/rule-simulation?ruleName=${encodeURIComponent(ruleName)}`);
  };

  const handleViewJson = () => {
    setShowJsonModal(true);
  };

  const handleCloseJsonModal = () => {
    setShowJsonModal(false);
  };

  const actionNames = actionOptions.filter((a) => actions.includes(a.value)).map((a) => a.json);

  const getRuleJson = () => {
    return JSON.stringify({
      ruleName,
      category,
      description,
      // Scope uses "ANY" for all values, as in the rule engine's JSON
      network: scopeValue(selectedNetworks),
      channel: scopeValue(selectedChannels),
      access_channel: scopeValue(selectedAccessChannels),
      transaction_type: scopeValue(selectedTransactionTypes),
      ...logicJson(logic),
      actions: actionNames,
    }, null, 2);
  };

  // Generate human-readable summary
  const generateHumanReadableSummary = () => {
    const networkText = scopeText(selectedNetworks, "all networks");
    const channelText = scopeText(selectedChannels, "all channels");
    const accessText = scopeText(selectedAccessChannels, "all access channels");
    const typeText = scopeText(selectedTransactionTypes, "all transaction types");
    const actionText = actionNames.length ? actionNames.join(" + ") : "no action selected";
    return `This rule applies to ${networkText}, ${channelText}, ${accessText} and ${typeText}. It triggers when ${readsAs}. Actions: ${actionText}.`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? `Edit Rule: ${ruleName}` : "Create New Rule"}
          </h1>
          {/* <p className="text-sm text-gray-600 mt-1">
            Build fraud detection rules using visual components
          </p> */}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Play className="h-4 w-4" />
            Run Simulation
          </button>
          {/* <button
            onClick={handleViewJson}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            View JSON
          </button> */}
          <button
            onClick={handleSaveToSandbox}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Save className="h-4 w-4" />
            Save to Sandbox
          </button>
        </div>
      </div>

      {mtbRule && (
        <div className="mb-4 bg-white border border-gray-200 rounded-lg px-5 py-3 text-sm">
          <p className="text-gray-700">
            <span className="font-semibold text-gray-900">{mtbRule.brdRef} ({mtbRule.book}):</span>{" "}
            {mtbRule.brdText}
          </p>
          {mtbRule.gaps.length > 0 && (
            <div className={`mt-2 rounded-md px-3 py-2 ${mtbRule.coverage === "partial" ? "bg-yellow-50 text-yellow-800" : "bg-gray-50 text-gray-600"}`}>
              <p className="font-medium">
                {mtbRule.coverage === "partial" ? "Partly covered by today's fields" : "Notes"}
              </p>
              <ul className="list-disc pl-5">
                {mtbRule.gaps.map((g) => <li key={g}>{g}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rb-layout">
        {/* Rule editor: three numbered sections */}
        <div className="space-y-4" style={{ minWidth: 0 }}>
          {/* 1. Rule details: basics and where the rule applies */}
          <Section number={1} title="Rule details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Rule name
                </label>
                <input
                  id="rule-name"
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className={basicInputClass}
                  placeholder="High velocity transaction check"
                />
              </div>
              <div>
                <label htmlFor="rule-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="rule-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={basicInputClass}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Where the rule applies: empty selection means all */}
              <ChecklistDropdown
                label="Network"
                allLabel="All networks"
                options={scopeOptions.network}
                selected={selectedNetworks}
                onChange={setSelectedNetworks}
              />
              <ChecklistDropdown
                label="Channel"
                allLabel="All channels"
                options={scopeOptions.channel}
                selected={selectedChannels}
                onChange={setSelectedChannels}
              />
              <ChecklistDropdown
                label="Access channel"
                allLabel="All access channels"
                options={scopeOptions.accessChannel}
                selected={selectedAccessChannels}
                onChange={setSelectedAccessChannels}
              />
              <ChecklistDropdown
                label="Transaction type"
                allLabel="All transaction types"
                options={scopeOptions.transactionType}
                selected={selectedTransactionTypes}
                onChange={setSelectedTransactionTypes}
              />
              <div className="col-span-2">
                <label htmlFor="rule-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="rule-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="What this rule detects"
                />
              </div>
            </div>
          </Section>

          {/* 2. Conditions: single conditions and groups, joined by AND, OR or Followed by */}
          <Section number={2} title="Conditions">
            {/* The conditions as one table: top bar, headings, rows, group header rows */}
            <div className="rb-table">
              <div className="rb-table-bar">
                <span>Match</span>
                <div className="inline-flex p-1 bg-gray-100 rounded-lg gap-1" role="radiogroup" aria-label="How items combine">
                  {operators.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={logic.operator === o.value}
                      onClick={() => setLogic((l) => ({ ...l, operator: o.value }))}
                      title={o.hint}
                      className={`px-3 py-1 rounded-md text-xs transition-colors ${
                        logic.operator === o.value
                          ? "bg-white shadow-sm text-gray-900 font-semibold"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4" style={{ marginLeft: "auto" }}>
                  {addLink(singleOps.add, "Condition")}
                  {addLink(addGroup, "Group")}
                </div>
              </div>
              <div className="rb-th rb-cond-row">
                <span>Field</span>
                <span>Condition</span>
                <span>Value</span>
                <span>Time window</span>
                <span />
              </div>
              {logic.items.length === 0 ? (
                <div className="rb-tr text-sm text-gray-500" style={{ padding: "12px" }}>
                  No conditions yet. Add a condition or a group.
                </div>
              ) : (
                logic.items.map((item, i) => (
                  <div key={item.id} className="rb-item">
                    {i > 0 && renderConnector(item, i)}
                    {renderItem(item, i)}
                  </div>
                ))
              )}
            </div>

            {/* The whole rule in plain words */}
            <p className="text-sm text-gray-500" style={{ marginTop: 12 }}>
              {readsAs}
            </p>
          </Section>

          {/* 3. Actions: one or more */}
          <Section number={3} title="Actions" inline>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Actions">
              {actionOptions.map((a) => {
                const on = actions.includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggleAction(a.value)}
                    title={a.hint}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-colors ${
                      on
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center rounded border flex-shrink-0 ${
                        on ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300"
                      }`}
                      style={{ width: 14, height: 14 }}
                    >
                      {on && <Check className="h-3 w-3" />}
                    </span>
                    {a.label}
                  </button>
                );
              })}
            </div>
            {actions.length === 0 && (
              <span className="text-xs text-red-600">Choose at least one action.</span>
            )}
          </Section>
        </div>

        {/* Right Panel: Rule Summary */}
        <div style={{ minWidth: 0 }}>
          <div className="rb-summary-card bg-white border border-gray-200 rounded-lg p-5 sticky top-8 space-y-5">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Rule Summary
              </h3>

              {/* Human-Readable Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {generateHumanReadableSummary()}
                </p>
              </div>

              {/* Structured Summary */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Actions
                  </p>
                  {actions.length === 0 ? (
                    <p className="text-sm text-red-600">None selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {actionOptions
                        .filter((a) => actions.includes(a.value))
                        .map((a) => (
                          <span key={a.value} className={`inline-flex items-center px-2 py-1 rounded text-sm font-bold ${a.pill}`}>
                            {a.value}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* View JSON Button */}
              <button
                onClick={handleViewJson}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <Code className="h-4 w-4" />
                View JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Rule JSON</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-y-auto h-96">
              <code className="text-sm">
                {getRuleJson()}
              </code>
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseJsonModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
