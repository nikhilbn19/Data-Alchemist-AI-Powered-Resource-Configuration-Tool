// ✅ Client Type
export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string; // Example: "T1,T2"
  GroupTag: string;
  AttributesJSON: string; // Example: '{"region": "US"}'
  [key: string]: string | number | unknown; // ✅ Allows dynamic property access (for grid/search/validation)
}

// ✅ Worker Type
export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string; // Example: "skill1,skill2"
  AvailableSlots: string; // Example: "[1,2,3]"
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;
  [key: string]: string | number | unknown;
}

// ✅ Task Type
export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string; // Example: "skillA,skillB"
  PreferredPhases: string; // Example: "[1,2]" or "1-3"
  MaxConcurrent: number;
  [key: string]: string | number | unknown;
}

// ✅ Rule Parameters Type
export type RuleParameters = string[] | Record<string, unknown>;

// ✅ Rule Type
export interface Rule {
  type: string;
  parameters?: RuleParameters;
  [key: string]: unknown;
}

// ✅ Prioritization Weights Type
export interface Priorities {
  priorityLevel: number;
  taskFulfillment: number;
  fairness: number;
  workloadBalance: number;
}

// ✅ Parsed File Data Structure
export interface ParsedFileData {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
}

// ✅ Search Query Type (Basic string)
export type SearchQuery = string;

// ✅ Searchable Data Union (For Filters/Searches)
export type SearchableData = Client | Worker | Task;

// ✅ Rule Suggestion Structure
export interface RuleSuggestion {
  id: string;
  message: string;
  rule: Rule;
}
