"use client";

import { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import ValidationPanel from "../components/ValidationPanel";
import RuleBuilder from "../components/RuleBuilder";
import PrioritizationPanel from "../components/PrioritizationPanel";
import SearchBar from "../components/SearchBar";

import { parseCSV, parseXLSX } from "../utils/parser";
import { validateData } from "../utils/validator";
import { applySearchQuery } from "../utils/searchParser";
import { generateRuleSuggestions } from "../utils/ruleSuggester";
import { generateRulesJson } from "../utils/rulesGenerator";
import { downloadJSON } from "../utils/exporter";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import {
  Client,
  Worker,
  Task,
  ParsedFileData,
  Rule,
  Priorities,
} from "../types/types";

// ✅ Helper to safely convert unknown types for DataGrid and CSV
const convertToSafeRows = (
  rows: (Client | Worker | Task)[]
): Record<string, string | number | boolean | null>[] => {
  return rows.map((row) => {
    const safeRow: Record<string, string | number | boolean | null> = {};

    Object.entries(row).forEach(([key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        safeRow[key] = value;
      } else {
        safeRow[key] = value !== undefined ? JSON.stringify(value) : "";
      }
    });

    return safeRow;
  });
};

export default function Home() {
  const [data, setData] = useState<ParsedFileData>({
    clients: [],
    workers: [],
    tasks: [],
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [priorities, setPriorities] = useState<Priorities>({
    priorityLevel: 50,
    taskFulfillment: 50,
    fairness: 50,
    workloadBalance: 50,
  });

  const [taskSearchQuery, setTaskSearchQuery] = useState<string>("");
  const [clientSearchQuery, setClientSearchQuery] = useState<string>("");
  const [workerSearchQuery, setWorkerSearchQuery] = useState<string>("");

  // ✅ File Upload Handler
  const handleFileUpload = async (
    file: File,
    fileType: keyof ParsedFileData
  ) => {
    try {
      const parsed = file.name.endsWith(".csv")
        ? await parseCSV(file)
        : await parseXLSX(file);

      setData((prev) => ({
        ...prev,
        [fileType]: parsed as Client[] | Worker[] | Task[],
      }));
    } catch (error) {
      console.error("Parsing error:", error);
      alert("❌ Error parsing file.");
    }
  };

  // ✅ Generate Columns
  const generateColumns = (
    rows: Record<string, string | number | boolean | null>[]
  ): GridColDef[] => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).map((key) => ({
      field: key,
      headerName: key,
      width: 150,
    }));
  };

  // ✅ Validation Hook
  useEffect(() => {
    const errors = validateData(data.clients, data.workers, data.tasks);
    setValidationErrors(errors);
  }, [data]);

  // ✅ Filtered Data
  const filteredTasks = applySearchQuery(data.tasks, taskSearchQuery);
  const filteredClients = applySearchQuery(data.clients, clientSearchQuery);
  const filteredWorkers = applySearchQuery(data.workers, workerSearchQuery);

  // ✅ Export Handler
  const handleExportAll = () => {
    if (
      data.clients.length === 0 &&
      data.workers.length === 0 &&
      data.tasks.length === 0
    ) {
      alert("⚠️ No data to export.");
      return;
    }

    const output = {
      clients: filteredClients,
      workers: filteredWorkers,
      tasks: filteredTasks,
      ...generateRulesJson({ rules, priorities }),
    };

    downloadJSON(output, "data-alchemist-output.json");
    alert("✅ Export complete!");
  };

  // ✅ AI Suggestions Handler
  const handleAISuggestions = () => {
    const suggestions = generateRuleSuggestions(
      data.clients,
      data.workers,
      data.tasks
    );

    if (suggestions.length === 0) {
      alert("✅ No AI suggestions found.");
      return;
    }

    const confirm = window.confirm(
      `🤖 Found ${suggestions.length} AI suggestions. Apply them?`
    );

    if (confirm) {
      const newRules = suggestions.map((s) => s.rule);
      setRules((prev) => [...prev, ...newRules]);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Data Alchemist</h1>

      <FileUploader onFileUpload={handleFileUpload} />
      <ValidationPanel errors={validationErrors} />
      <RuleBuilder rules={rules} setRules={setRules} />
      <PrioritizationPanel
        priorities={priorities}
        setPriorities={setPriorities}
      />

      {/* 👉 Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleAISuggestions}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          🤖 AI Suggest Rules
        </button>

        <button
          onClick={handleExportAll}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🚀 Export (Data + Rules + Priorities)
        </button>
      </div>

      {/* 👉 Data Display */}
      {(["clients", "workers", "tasks"] as (keyof ParsedFileData)[]).map(
        (type) => {
          const filtered =
            type === "tasks"
              ? filteredTasks
              : type === "clients"
              ? filteredClients
              : filteredWorkers;

          const safeRows = convertToSafeRows(filtered);

          return (
            <div key={type} className="mt-10">
              <h2 className="text-2xl font-semibold mb-2">
                {type.toUpperCase()}
              </h2>

              <SearchBar
                onSearch={(query) => {
                  if (type === "tasks") setTaskSearchQuery(query);
                  if (type === "clients") setClientSearchQuery(query);
                  if (type === "workers") setWorkerSearchQuery(query);
                }}
              />

              <div className="h-[400px] bg-white shadow rounded">
                <DataGrid
                  rows={safeRows.map((row, index) => ({
                    id: index,
                    ...row,
                  }))}
                  columns={generateColumns(safeRows)}
                  pageSizeOptions={[5, 10]}
                  disableRowSelectionOnClick
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
