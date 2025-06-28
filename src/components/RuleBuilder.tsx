"use client";

import { useState } from "react";
import { parseRuleFromText } from "../utils/naturalRuleParser";

export type Rule = {
  type: string;
  parameters?: string[] | Record<string, unknown>;
  [key: string]: unknown;
};

export default function RuleBuilder({
  rules,
  setRules,
}: {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
}) {
  const [ruleType, setRuleType] = useState("coRun");
  const [paramInput, setParamInput] = useState("");
  const [naturalRuleInput, setNaturalRuleInput] = useState("");

  const handleAddRule = () => {
    if (!paramInput) return;
    const params = paramInput
      .split(",")
      .map((s) => s.trim())
      .filter((x) => x);

    const newRule: Rule = {
      type: ruleType,
      parameters: params,
    };

    setRules((prev) => [...prev, newRule]);
    setParamInput("");
  };

  const handleAddNaturalRule = () => {
    const parsed = parseRuleFromText(naturalRuleInput);
    if (parsed) {
      setRules((prev) => [...prev, parsed]);
      setNaturalRuleInput("");
    } else {
      alert("❌ Could not understand the rule. Try a different phrasing.");
    }
  };

  const handleDeleteRule = (index: number) => {
    setRules((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="p-4 bg-blue-50 border rounded mt-6">
      <h3 className="text-xl font-bold mb-4">⚙️ Rule Builder</h3>

      <div className="flex gap-4 items-center mb-4">
        <select
          className="border p-2 rounded"
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value)}
        >
          <option value="coRun">Co-Run Tasks</option>
          <option value="slotRestriction">Slot Restriction</option>
          <option value="loadLimit">Load Limit</option>
          <option value="phaseWindow">Phase Window</option>
          <option value="patternMatch">Pattern Match</option>
          <option value="precedenceOverride">Precedence Override</option>
        </select>

        <input
          className="border p-2 rounded flex-1"
          placeholder="Enter parameters (e.g. TaskID1, TaskID2)"
          value={paramInput}
          onChange={(e) => setParamInput(e.target.value)}
        />

        <button
          onClick={handleAddRule}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Rule
        </button>
      </div>

      <div className="mt-6 p-4 border rounded bg-white">
        <h4 className="text-lg font-semibold mb-2">
          🪄 AI Rule Converter (Natural Language)
        </h4>

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder='e.g., "Make tasks T1 and T2 co-run"'
          value={naturalRuleInput}
          onChange={(e) => setNaturalRuleInput(e.target.value)}
        />

        <button
          onClick={handleAddNaturalRule}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ✨ Add Rule from Text
        </button>
      </div>

      <div className="mt-6">
        {rules.length === 0 ? (
          <p className="text-gray-600">No rules added yet.</p>
        ) : (
          <ul className="list-disc ml-5 space-y-1">
            {rules.map((rule, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
              >
                <span>
                  <strong>{rule.type}</strong>:{" "}
                  {rule.parameters
                    ? Array.isArray(rule.parameters)
                      ? rule.parameters.join(", ")
                      : JSON.stringify(rule.parameters)
                    : JSON.stringify(rule)}
                </span>
                <button
                  onClick={() => handleDeleteRule(i)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
