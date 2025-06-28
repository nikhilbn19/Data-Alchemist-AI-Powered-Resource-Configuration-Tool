import { Rule } from "../components/RuleBuilder";
import { Priorities } from "../components/PrioritizationPanel";

export function generateRulesJson({
  rules,
  priorities,
}: {
  rules: Rule[];
  priorities: Priorities;
}) {
  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0",
    },
    priorities: {
      clientPriorityWeight: priorities.priorityLevel,
      taskFulfillmentWeight: priorities.taskFulfillment,
      fairnessWeight: priorities.fairness,
      workloadBalanceWeight: priorities.workloadBalance,
    },
    rules: rules.map((r) => ({
      type: r.type,
      parameters: r.parameters,
    })),
  };
}
