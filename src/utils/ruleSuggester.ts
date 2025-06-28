import { Client, Worker, Task, RuleSuggestion } from "../types/types";

export function generateRuleSuggestions(
  clients: Client[],
  workers: Worker[],
  tasks: Task[]
): RuleSuggestion[] {
  const suggestions: RuleSuggestion[] = [];

  // 🔗 Co-Run Suggestion: Tasks frequently requested together
  const taskPairs: Record<string, number> = {};
  clients.forEach((client) => {
    const tasksList = (client.RequestedTaskIDs || "")
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

  // 🚫 Worker Overload Suggestion
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

  // ⏳ Phase Window Suggestion based on Task Duration
  tasks.forEach((task) => {
    if (task.Duration > 8) {
      suggestions.push({
        id: `phase-${task.TaskID}`,
        message: `⏳ Task ${task.TaskID} has a long duration (${task.Duration}). Suggest limiting to phases 1-2.`,
        rule: {
          type: "phaseWindow",
          parameters: {
            task: task.TaskID,
            allowedPhases: [1, 2],
          },
        },
      });
    }
  });

  return suggestions;
}

// ✅ Helper function
function parseAvailableSlots(slots: string | number[] | undefined): number[] {
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
