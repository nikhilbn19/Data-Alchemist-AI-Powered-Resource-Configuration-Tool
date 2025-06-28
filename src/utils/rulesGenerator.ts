import { Rule } from "../components/RuleBuilder";

export function generateRulesJson(rules: Rule[]) {
  return {
    rules: rules.map((r) => ({
      type: r.type,
      parameters: r.parameters,
    })),
  };
}
