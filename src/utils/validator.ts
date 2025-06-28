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
export function getMissingColumns(data: any[], requiredColumns: string[]) {
  if (!data || data.length === 0) return requiredColumns;
  const fileColumns = Object.keys(data[0]);
  return requiredColumns.filter((col) => !fileColumns.includes(col));
}

// ✅ Duplicate IDs Checker
export function getDuplicateIds(data: any[], idField: string) {
  const seen = new Set();
  const duplicates: string[] = [];
  data.forEach((item) => {
    const id = item[idField];
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  });
  return duplicates;
}

// ✅ JSON Validator Helper
export function isValidJson(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === 'object';
  } catch (e) {
    return false;
  }
}

// ✅ Combined Validator Function
export function validateData(
  clients: any[],
  workers: any[],
  tasks: any[]
) {
  const errors: string[] = [];

  // 🔍 Check Missing Columns
  const missingClientCols = getMissingColumns(clients, requiredClientColumns);
  const missingWorkerCols = getMissingColumns(workers, requiredWorkerColumns);
  const missingTaskCols = getMissingColumns(tasks, requiredTaskColumns);

  if (missingClientCols.length)
    errors.push(`❌ Clients missing columns: ${missingClientCols.join(", ")}`);
  if (missingWorkerCols.length)
    errors.push(`❌ Workers missing columns: ${missingWorkerCols.join(", ")}`);
  if (missingTaskCols.length)
    errors.push(`❌ Tasks missing columns: ${missingTaskCols.join(", ")}`);

  // 🔍 Check Duplicate IDs
  const duplicateClientIds = getDuplicateIds(clients, "ClientID");
  const duplicateWorkerIds = getDuplicateIds(workers, "WorkerID");
  const duplicateTaskIds = getDuplicateIds(tasks, "TaskID");

  if (duplicateClientIds.length)
    errors.push(`❌ Duplicate ClientIDs: ${duplicateClientIds.join(", ")}`);
  if (duplicateWorkerIds.length)
    errors.push(`❌ Duplicate WorkerIDs: ${duplicateWorkerIds.join(", ")}`);
  if (duplicateTaskIds.length)
    errors.push(`❌ Duplicate TaskIDs: ${duplicateTaskIds.join(", ")}`);

  // 🔥 Additional Data Validations

  const taskIDs = tasks.map((t) => t.TaskID);
  const workerSkills = workers.flatMap((w) =>
    (w.Skills || "").split(",").map((s: string) => s.trim())
  );

  // ✅ Clients
  clients.forEach((client, index) => {
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
      .map((t: string) => t.trim());
    requestedTasks.forEach((tid: string) => {
    if (!taskIDs.includes(tid)) {
    errors.push(
      `❌ ClientID ${client.ClientID} → RequestedTaskID '${tid}' not found`
    );
  }
});
});

  // ✅ Workers
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

  // ✅ Tasks
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
      .map((s: string) => s.trim());
      requiredSkills.forEach((skill: string) => {
      if (!workerSkills.includes(skill)) {
       errors.push(
      `❌ TaskID ${task.TaskID} → RequiredSkill '${skill}' not found in any worker`
       );
    }
   });


    // Check PreferredPhases
    const pref = task.PreferredPhases;
    if (
      !pref ||
      (!pref.startsWith("[") &&
        !pref.includes("-") &&
        isNaN(Number(pref)))
    ) {
      errors.push(
        `❌ TaskID ${task.TaskID} → PreferredPhases is malformed`
      );
    }
  });

  if (errors.length === 0) {
    errors.push("✅ No validation errors found!");
  }

  return errors;
}
