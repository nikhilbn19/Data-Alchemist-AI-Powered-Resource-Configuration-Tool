interface RuleSuggestion {
  id: string;
  message: string;
  rule: any;
}

interface Client {
  RequestedTaskIDs?: string;
}

interface Worker {
  WorkerID: string;
  AvailableSlots: string | number[];
  MaxLoadPerPhase: number;
  WorkerGroup: string;
}

interface Task {
  TaskID: string;
}

export function generateRuleSuggestions(
  clients: Client[],
  workers: Worker[],
  tasks: Task[]
): RuleSuggestion[] {
  const suggestions: RuleSuggestion[] = [];

  // 🔗 Co-Run Suggestion: Tasks frequently requested together
  const taskPairs: Record<string, number> = {};
  clients.forEach((client: Client) => {
    const tasksList: string[] = (client.RequestedTaskIDs || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter((t) => t.length > 0);

    tasksList.forEach((a: string, i: number) => {
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
        rule: { type: "coRun", tasks: taskList },
      });
    }
  });

  // 🚫 Overloaded Worker Suggestion
  workers.forEach((worker: Worker) => {
    const slots = parseAvailableSlots(worker.AvailableSlots);
    if (slots.length < worker.MaxLoadPerPhase) {
      suggestions.push({
        id: `overload-${worker.WorkerID}`,
        message: `⚠️ Worker ${worker.WorkerID} has only ${slots.length} slots but MaxLoadPerPhase is ${worker.MaxLoadPerPhase}. Suggest reducing load.`,
        rule: {
          type: "loadLimit",
          workerGroup: worker.WorkerGroup,
          maxSlotsPerPhase: slots.length,
        },
      });
    }
  });

  return suggestions;
}

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
