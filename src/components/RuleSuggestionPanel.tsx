import { Rule, RuleSuggestion, Client, Worker, Task } from "../types/types";

// ✅ Generate Rule Suggestions Based on Data
export function generateRuleSuggestions(
  clients: Client[],
  workers: Worker[],
  tasks: Task[]
): RuleSuggestion[] {
  const suggestions: RuleSuggestion[] = [];

  // 🔗 Co-Run Suggestion: Tasks frequently requested together
  const taskPairs: Record<string, number> = {};
  clients.forEach((client) => {
    const tasksList: string[] = (client.RequestedTaskIDs || "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    tasksList.forEach((a, i) => {
      for (let j = i + 1; j < tasksList.length; j++) {
        const b = tasksList[j];
        const key = [a, b].sort().join("-");
        taskPairs[key] = (taskPairs[key] || 0) + 1;
      }
    });
  });

  Object.entries(taskPairs).forEach(([pair, count]) => {
    if (count >= 2) {
      const taskList = pair.split("-");
      suggestions.push({
        id: `corun-${pair}`,
        message: `🤝 Suggest Co-Run for tasks ${taskList.join(", ")} (requested together ${count} times)`,
        rule: { type: "coRun", parameters: taskList },
      });
    }
  });

  // 🚫 Overloaded Worker Suggestion
  workers.forEach((worker) => {
    const slots = parseAvailableSlots(worker.AvailableSlots);
    if (slots.length < worker.MaxLoadPerPhase) {
      suggestions.push({
        id: `overload-${worker.WorkerID}`,
        message: `⚠️ Worker ${worker.WorkerID} has only ${slots.length} slots but MaxLoadPerPhase is ${worker.MaxLoadPerPhase}. Suggest reducing load.`,
        rule: {
          type: "loadLimit",
          parameters: {
            workerGroup: worker.WorkerGroup,
            maxSlotsPerPhase: slots.length,
          },
        },
      });
    }
  });

  // 🏷️ Category-Specific Suggestion (Example rule for tasks)
  const categories = new Set(tasks.map((t) => t.Category));
  categories.forEach((category) => {
    suggestions.push({
      id: `prefer-category-${category}`,
      message: `✨ Prefer assigning tasks of category '${category}' together.`,
      rule: {
        type: "preferCategory",
        parameters: {
          category,
        },
      },
    });
  });

  return suggestions;
}

// ✅ Helper to parse AvailableSlots string safely
function parseAvailableSlots(
  slots: string | number[] | undefined
): number[] {
  try {
    if (typeof slots === "string") {
      const parsed = JSON.parse(slots);
      return Array.isArray(parsed) ? parsed : [];
    }
    return Array.isArray(slots) ? slots : [];
  } catch {
    return [];
  }
}
