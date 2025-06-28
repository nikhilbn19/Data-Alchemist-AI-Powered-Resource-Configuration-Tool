import Papa from "papaparse";
import * as XLSX from "xlsx";

// ✅ CSV Parser
export const parseCSV = (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

// ✅ XLSX Parser
export const parseXLSX = async (
  file: File
): Promise<Record<string, unknown>[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
};
