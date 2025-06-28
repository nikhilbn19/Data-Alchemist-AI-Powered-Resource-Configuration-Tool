"use client";

import { useState, useEffect } from "react";

interface RuleSuggestion {
  id: string;
  message: string;
  rule: any;
}

interface Props {
  clients: any[];
  workers: any[];
  tasks: any[];
  onAccept: (rule: any) => void;
}

export default function RuleSuggestionPanel({
  clients,
  workers,
  tasks,
  onAccept,
}: Props) {
  const [suggestions, setSuggestions] = useState<RuleSuggestion[]>([]);

  useEffect(() => {
    const { generateRuleSuggestions } = require("../utils/ruleSuggester");
    const result = generateRuleSuggestions(clients, workers, tasks);
    setSuggestions(result);
  }, [clients, workers, tasks]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">✨ AI Rule Suggestions</h3>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">✅ No suggestions — looks good!</p>
      ) : (
        suggestions.map((s) => (
          <div
            key={s.id}
            className="border p-3 rounded mb-2 flex justify-between items-center"
          >
            <div>{s.message}</div>
            <button
              onClick={() => {
                onAccept(s.rule);
                setSuggestions((prev) =>
                  prev.filter((item) => item.id !== s.id)
                );
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              ✅ Accept
            </button>
          </div>
        ))
      )}
    </div>
  );
}
