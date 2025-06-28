"use client";

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

  const sliders = [
    { key: "priorityLevel", label: "Client Priority Level" },
    { key: "taskFulfillment", label: "Task Fulfillment Preference" },
    { key: "fairness", label: "Fairness Across Clients" },
    { key: "workloadBalance", label: "Worker Workload Balance" },
  ];

  return (
    <div className="p-5 bg-yellow-50 border rounded-lg mt-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-4">🎯 Prioritization & Weights</h3>

      {sliders.map(({ key, label }) => (
        <div key={key} className="mb-5">
          <label className="block mb-2 text-md font-medium text-gray-700">
            {label}
          </label>

          <input
            type="range"
            min={0}
            max={100}
            value={priorities[key as keyof Priorities]}
            onChange={(e) =>
              handleChange(key as keyof Priorities, Number(e.target.value))
            }
            className="w-full accent-yellow-600"
          />

          <div className="mt-1 text-sm text-gray-600">
            Weight:{" "}
            <span className="font-semibold text-gray-800">
              {priorities[key as keyof Priorities]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
