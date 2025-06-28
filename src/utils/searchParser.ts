export function applySearchQuery(data: any[], query: string): any[] {
  if (!query.trim()) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter((item) => {
    try {
      let result = true;

      // ✅ Duration > N
      const durationGT = lowerQuery.match(/duration\s*>\s*(\d+)/);
      if (durationGT) {
        const val = parseInt(durationGT[1]);
        result = result && Number(item["Duration"]) > val;
      }

      // ✅ Duration < N
      const durationLT = lowerQuery.match(/duration\s*<\s*(\d+)/);
      if (durationLT) {
        const val = parseInt(durationLT[1]);
        result = result && Number(item["Duration"]) < val;
      }

      // ✅ PreferredPhases includes N
      const phaseMatch = lowerQuery.match(
        /preferredphases.*(?:includes|has)\s*(\d+)/
      );
      if (phaseMatch) {
        const phase = parseInt(phaseMatch[1]);
        const preferredPhases = parsePhases(item["PreferredPhases"]);
        result = result && preferredPhases.includes(phase);
      }

      // ✅ Category is X
      const categoryMatch = lowerQuery.match(/category\s*(?:is|=)\s*(\w+)/);
      if (categoryMatch) {
        const cat = categoryMatch[1];
        result =
          result &&
          String(item["Category"] || "").toLowerCase() === cat.toLowerCase();
      }

      // ✅ PriorityLevel > N (for clients)
      const priorityGT = lowerQuery.match(/prioritylevel\s*>\s*(\d+)/);
      if (priorityGT) {
        const val = parseInt(priorityGT[1]);
        result = result && Number(item["PriorityLevel"]) > val;
      }

      // ✅ Skills includes X (for workers)
      const skillsMatch = lowerQuery.match(/skills.*(?:includes|has)\s*(\w+)/);
      if (skillsMatch) {
        const skill = skillsMatch[1].toLowerCase();
        const skills = (item["Skills"] || "")
          .split(",")
          .map((s: string) => s.trim().toLowerCase());
        result = result && skills.includes(skill);
      }

      return result;
    } catch {
      return true;
    }
  });
}

function parsePhases(value: any): number[] {
  if (typeof value === "string") {
    try {
      if (value.startsWith("[") && value.endsWith("]")) {
        return JSON.parse(value);
      } else if (value.includes("-")) {
        const [start, end] = value.split("-").map(Number);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      } else {
        return value
          .split(",")
          .map((v) => Number(v.trim()))
          .filter((n) => !isNaN(n));
      }
    } catch {
      return [];
    }
  }
  return [];
}
