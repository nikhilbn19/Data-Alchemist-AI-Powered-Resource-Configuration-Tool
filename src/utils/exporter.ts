type JsonData = Record<string, unknown>;
type CsvRow = Record<string, string | number | boolean | null | undefined>;

/**
 * 🔽 Download data as JSON file
 */
export function downloadJSON(data: JsonData, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
}

/**
 * 🔽 Download data as CSV file
 */
export function downloadCSV(data: CsvRow[], filename: string) {
  if (data.length === 0) {
    alert(`⚠️ No data to export for ${filename}`);
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((field) => {
          const val = row[field];
          if (typeof val === "object" && val !== null) {
            return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          }
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
}

/**
 * 🔽 Helper to trigger download
 */
function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
