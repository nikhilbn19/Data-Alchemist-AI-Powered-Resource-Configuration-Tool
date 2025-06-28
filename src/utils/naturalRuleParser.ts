import { Rule } from "../components/RuleBuilder";

export function parseRuleFromText(input: string): Rule | null {
  const lower = input.toLowerCase();

  // 🔗 Co-Run Rule
  if (lower.includes("co-run") && lower.includes("tasks")) {
    const tasks = input.match(/t\d+/gi) || [];
    if (tasks.length >= 2) {
      return { type: "coRun", parameters: tasks };
    }
  }

  // 📦 Load Limit Rule
  const loadLimitMatch = input.match(/limit workers in (\w+) to (\d+)/i);
  if (loadLimitMatch) {
    return {
      type: "loadLimit",
      parameters: {
        workerGroup: loadLimitMatch[1],
        maxSlotsPerPhase: Number(loadLimitMatch[2]),
      },
    };
  }

  // ⏳ Phase Window Rule
  const phaseMatch = input.match(/task (\w+) allowed in phases? ([\d,\- ]+)/i);
  if (phaseMatch) {
    const phases = phaseMatch[2]
      .split(/[,\- ]+/)
      .map((p) => Number(p.trim()))
      .filter((n) => !isNaN(n));

    return {
      type: "phaseWindow",
      parameters: {
        task: phaseMatch[1],
        allowedPhases: phases,
      },
    };
  }

  return null;
}
