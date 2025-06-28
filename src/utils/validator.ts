import { Client, Worker, Task } from "../types/types";

// ✅ Expected Columns
export const requiredClientColumns = [
  "ClientID",
  "ClientName",
  "PriorityLevel",
  "RequestedTaskIDs",
  "GroupTag",
  "AttributesJSON",
];

export const requiredWorkerColumns = [
  "WorkerID",
  "WorkerName",
  "Skills",
  "AvailableSlots",
  "MaxLoadPerPhase",
  "WorkerGroup",
  "QualificationLevel",
];

export const requiredTaskColumns = [
  "TaskID",
  "TaskName",
  "Category",
  "Duration",
  "RequiredSkills",
  "PreferredPhases",
  "MaxConcurrent",
];

// ✅ Missing Columns Checker
export function getMissingColumns<T extends object>(
  data: T[],
  requiredColumns: string[]
): string[] {
  if (!data.length) return requiredColumns;
  const fileColumns = Object.keys(data[0]);
  return requiredColumns.filter((col) => !fileColumns.includes(col));
}

// ✅ Duplicate IDs Checker
export function getDuplicateIds<T extends object>(
  data: T[],
  idField: keyof T
): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  data.forEach((item) => {
    const id = String(item[idField]);
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  });

  return duplicates;
}

// ✅ JSON Validator
export function isValidJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

// ✅ Main Validation Function
export function validateData(
  clients: Client[],
  workers: Worker[],
  tasks: Task[]
): string[] {
  const errors: string[] = [];

  // 🔍 Missing Columns
  const missingClientCols = getMissingColumns(clients, requiredClientColumns);
  const missingWorkerCols = getMissingColumns(workers, requiredWorkerColumns);
  const missingTaskCols = getMissingColumns(tasks, requiredTaskColumns);

  if (missingClientCols.length)
    errors.push(`❌ Clients missing columns: ${missingClientCols.join(", ")}`);
  if (missingWorkerCols.length)
    errors.push(`❌ Workers missing columns: ${missingWorkerCols.join(", ")}`);
  if (missingTaskCols.length)
    errors.push(`❌ Tasks missing columns: ${missingTaskCols.join(", ")}`);

  // 🔍 Duplicate IDs
  const duplicateClientIds = getDuplicateIds(clients, "ClientID");
  const duplicateWorkerIds = getDuplicateIds(workers, "WorkerID");
  const duplicateTaskIds = getDuplicateIds(tasks, "TaskID");

  if (duplicateClientIds.length)
    errors.push(`❌ Duplicate ClientIDs: ${duplicateClientIds.join(", ")}`);
  if (duplicateWorkerIds.length)
    errors.push(`❌ Duplicate WorkerIDs: ${duplicateWorkerIds.join(", ")}`);
  if (duplicateTaskIds.length)
    errors.push(`❌ Duplicate TaskIDs: ${duplicateTaskIds.join(", ")}`);

  // 🔥 Additional Data Validation
  const taskIDs = tasks.map((t) => t.TaskID);
  const workerSkills = workers.flatMap((w) =>
    (w.Skills || "").split(",").map((s) => s.trim())
  );

  // ✅ Clients Validation
  clients.forEach((client) => {
    if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
      errors.push(
        `❌ ClientID ${client.ClientID} → PriorityLevel must be between 1 and 5`
      );
    }

    if (!isValidJson(client.AttributesJSON)) {
      errors.push(
        `❌ ClientID ${client.ClientID} → AttributesJSON is not valid JSON`
      );
    }

    const requestedTasks = (client.RequestedTaskIDs || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    requestedTasks.forEach((tid) => {
      if (!taskIDs.includes(tid)) {
        errors.push(
          `❌ ClientID ${client.ClientID} → RequestedTaskID '${tid}' not found`
        );
      }
    });
  });

  // ✅ Workers Validation
  workers.forEach((worker) => {
    try {
      const slots = JSON.parse(worker.AvailableSlots);
      if (!Array.isArray(slots)) {
        errors.push(
          `❌ WorkerID ${worker.WorkerID} → AvailableSlots must be an array`
        );
      }
    } catch {
      errors.push(
        `❌ WorkerID ${worker.WorkerID} → AvailableSlots is not valid JSON array`
      );
    }
  });

  // ✅ Tasks Validation
  tasks.forEach((task) => {
    if (task.Duration < 1) {
      errors.push(
        `❌ TaskID ${task.TaskID} → Duration must be greater than or equal to 1`
      );
    }
    if (task.MaxConcurrent < 1) {
      errors.push(
        `❌ TaskID ${task.TaskID} → MaxConcurrent must be greater than or equal to 1`
      );
    }

    const requiredSkills = (task.RequiredSkills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    requiredSkills.forEach((skill) => {
      if (!workerSkills.includes(skill)) {
        errors.push(
          `❌ TaskID ${task.TaskID} → RequiredSkill '${skill}' not found in any worker`
        );
      }
    });

    const pref = task.PreferredPhases;
    if (
      !pref ||
      (!pref.startsWith("[") &&
        !pref.includes("-") &&
        isNaN(Number(pref)))
    ) {
      errors.push(`❌ TaskID ${task.TaskID} → PreferredPhases is malformed`);
    }
  });

  // ✅ No Errors
  if (errors.length === 0) {
    errors.push("✅ No validation errors found!");
  }

  return errors;
}
