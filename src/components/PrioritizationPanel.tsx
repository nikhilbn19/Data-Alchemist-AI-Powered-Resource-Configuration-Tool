"use client";

import { useState } from "react";

export type Priorities = {
  priorityLevel: number;
  taskFulfillment: number;
  fairness: number;
  workloadBalance: number;
};

export default function PrioritizationPanel({
  priorities,
  setPriorities,
}: {
  priorities: Priorities;
  setPriorities: (p: Priorities) => void;
}) {
  const handleChange = (key: keyof Priorities, value: number) => {
    setPriorities({ ...priorities, [key]: value });
  };

  return (
    <div className="p-4 bg-yellow-50 border rounded mt-6">
      <h3 className="text-xl font-bold mb-4">🎯 Prioritization & Weights</h3>

      {[
        { key: "priorityLevel", label: "Client Priority Level" },
        { key: "taskFulfillment", label: "Task Fulfillment" },
        { key: "fairness", label: "Fairness Across Clients" },
        { key: "workloadBalance", label: "Workload Balance on Workers" },
      ].map(({ key, label }) => (
        <div key={key} className="mb-4">
          <label className="block mb-1 font-medium">{label}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={priorities[key as keyof Priorities]}
            onChange={(e) =>
              handleChange(key as keyof Priorities, Number(e.target.value))
            }
            className="w-full"
          />
          <div>Weight: {priorities[key as keyof Priorities]}</div>
        </div>
      ))}
    </div>
  );
}
