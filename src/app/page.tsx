"use client";

import { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import { parseCSV, parseXLSX } from "../utils/parser";
import { validateData } from "../utils/validator";
import ValidationPanel from "../components/ValidationPanel";
import RuleBuilder, { Rule } from "../components/RuleBuilder";
import { generateRulesJson } from "../utils/rulesGenerator";
import PrioritizationPanel, { Priorities } from "../components/PrioritizationPanel";
import SearchBar from "../components/SearchBar";
import { applySearchQuery } from "../utils/searchParser";
import { generateRuleSuggestions } from "../utils/ruleSuggester";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function Home() {
  const [data, setData] = useState<Record<string, any[]>>({
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

  // 🔍 Search States
  const [taskSearchQuery, setTaskSearchQuery] = useState<string>("");
  const [clientSearchQuery, setClientSearchQuery] = useState<string>("");
  const [workerSearchQuery, setWorkerSearchQuery] = useState<string>("");

  // ✅ File Upload Handler
  const handleFileUpload = async (file: File, fileType: string) => {
    try {
      const isCSV = file.name.endsWith(".csv");
      const parsed = isCSV ? await parseCSV(file) : await parseXLSX(file);
      setData((prev) => ({ ...prev, [fileType]: parsed }));
    } catch (error) {
      console.error("Parsing error:", error);
      alert("Error parsing file");
    }
  };

  // ✅ Generate Columns Dynamically
  const generateColumns = (rows: any[]): GridColDef[] => {
    if (!rows || rows.length === 0) return [];
    return Object.keys(rows[0]).map((key) => ({
      field: key,
      headerName: key,
      width: 150,
      editable: true,
    }));
  };

  // ✅ Validation Hook
  useEffect(() => {
    const errors = validateData(data.clients, data.workers, data.tasks);
    setValidationErrors(errors);
  }, [data]);

  // ✅ Apply Search Filters
  const filteredTasks = applySearchQuery(data.tasks, taskSearchQuery);
  const filteredClients = applySearchQuery(data.clients, clientSearchQuery);
  const filteredWorkers = applySearchQuery(data.workers, workerSearchQuery);

  // ✅ Export Handler (Filtered Data + Rules + Priorities)
  const handleExportAll = () => {
    const combinedExport = {
      clients: filteredClients,
      workers: filteredWorkers,
      tasks: filteredTasks,
      rules: generateRulesJson(rules),
      priorities,
    };

    const blob = new Blob([JSON.stringify(combinedExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-alchemist-output.json";
    a.click();
  };

  // ✅ AI Rule Suggestion Handler
  const handleAISuggestions = () => {
    const suggestions = generateRuleSuggestions(
      data.clients,
      data.workers,
      data.tasks
    );

    if (suggestions.length === 0) {
      alert("✅ No AI rule suggestions found.");
      return;
    }

    const confirmApply = window.confirm(
      `🤖 Found ${suggestions.length} AI rule suggestions. Apply them?`
    );

    if (confirmApply) {
      const newRules = suggestions.map((s) => s.rule);
      setRules((prev) => [...prev, ...newRules]);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Data Alchemist</h1>

      {/* 🔗 File Upload */}
      <FileUploader onFileUpload={handleFileUpload} />

      {/* 🔍 Validation */}
      <ValidationPanel errors={validationErrors} />

      {/* ⚙️ Rule Builder */}
      <RuleBuilder rules={rules} setRules={setRules} />

      {/* 🎯 Prioritization */}
      <PrioritizationPanel
        priorities={priorities}
        setPriorities={setPriorities}
      />

      {/* 🚀 AI Suggestions Button */}
      <button
        onClick={handleAISuggestions}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        🤖 AI Suggest Rules
      </button>

      {/* 📦 Export */}
      <button
        onClick={handleExportAll}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded ml-4"
      >
        🚀 Export (Filtered Data + Rules + Priorities)
      </button>

      {/* 📊 Data Grids with Search */}
      {["clients", "workers", "tasks"].map((type) => {
        const filteredData =
          type === "tasks"
            ? filteredTasks
            : type === "clients"
            ? filteredClients
            : filteredWorkers;

        return (
          <div key={type} className="mt-10">
            <h2 className="text-2xl font-semibold mb-2">
              {type.toUpperCase()}
            </h2>

            {/* 🔍 Search Bar */}
            <SearchBar
              onSearch={(query) => {
                if (type === "tasks") setTaskSearchQuery(query);
                if (type === "clients") setClientSearchQuery(query);
                if (type === "workers") setWorkerSearchQuery(query);
              }}
            />

            <div className="h-[400px] bg-white shadow rounded">
              <DataGrid
                rows={filteredData.map((row, index) => ({
                  id: index,
                  ...row,
                }))}
                columns={generateColumns(filteredData)}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
