import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface ChecklistDropdownProps {
  label: string;
  /** Text shown when nothing specific is picked, e.g. "All channels" */
  allLabel: string;
  options: string[];
  /** Picked values; an empty list means "all" */
  selected: string[];
  onChange: (selected: string[]) => void;
}

/**
 * A compact multi-select: one box that shows the current choice and opens a
 * checklist with "All" at the top. Picking a value clears "All"; clearing every
 * value (or picking "All") goes back to all.
 */
export function ChecklistDropdown({ label, allLabel, options, selected, onChange }: ChecklistDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const isAll = selected.length === 0;

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (value: string) => {
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    // Keep the original option order; picking every option is the same as "all"
    const ordered = options.filter((o) => next.includes(o));
    onChange(ordered.length === options.length ? [] : ordered);
  };

  const summary = isAll
    ? allLabel
    : selected.length <= 2
      ? selected.join(", ")
      : `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`;

  return (
    <div ref={rootRef} className="relative">
      <p className="block text-sm font-medium text-gray-700 mb-1">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${summary}`}
        className="rb-control w-full flex items-center justify-between gap-2 px-3 border border-gray-300 rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        title={isAll ? allLabel : selected.join(", ")}
      >
        <span
          className={isAll ? "text-gray-500" : "text-gray-900"}
          style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {summary}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1"
          style={{ zIndex: 40, maxHeight: 260, overflowY: "auto" }}
        >
          <ChecklistOption label={allLabel} checked={isAll} onClick={() => onChange([])} />
          <div className="border-t border-gray-100" style={{ margin: "4px 0" }} />
          {options.map((opt) => (
            <ChecklistOption key={opt} label={opt} checked={selected.includes(opt)} onClick={() => toggle(opt)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistOption({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={checked}
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 text-left hover:bg-gray-50"
    >
      <span
        className={`flex items-center justify-center rounded border flex-shrink-0 ${
          checked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300"
        }`}
        style={{ width: 16, height: 16 }}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      {label}
    </button>
  );
}
