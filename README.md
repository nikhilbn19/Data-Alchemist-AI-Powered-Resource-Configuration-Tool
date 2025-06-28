
# 🚀 Data Alchemist — AI-Driven Resource Allocation Configurator

Tame your messy spreadsheets with AI. Upload data, validate, set rules, prioritize, and export.

---

## 📜 Project Overview

**Data Alchemist** is a web app built with **Next.js + TypeScript** to help users clean, validate, and configure resource allocation from CSV/XLSX files.

---

## ✅ Features

- Upload CSV/XLSX for **Clients**, **Workers**, and **Tasks**
- Validation with detailed error highlighting:
  - Duplicate Client IDs
  - Invalid JSON in Attributes
  - Missing or invalid Task IDs
  - Priority levels not between 1-5
- **Rule Builder:**
  - Create rules via dropdown or natural language
- **Prioritization Panel:**
  - Adjust client priority, fairness, task fulfillment with sliders
- Export cleaned data and `rules.json`

---

## 📂 Folder Structure

```
data-alchemist/
├── public/
│   └── samples/           # Sample CSV files
├── src/
│   ├── app/               # Main app entry
│   ├── components/        # UI components
│   └── utils/             # Parsing, validation, rules, search
├── README.md
├── package.json
└── next.config.js
```

---

## 🚀 Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🗂️ Sample Files Location

```
/public/samples/
```

Includes:
- `clients.csv`
- `workers.csv`
- `tasks.csv`

---

## 🎯 Milestones Covered

- ✔️ Data upload & validation
- ✔️ Editable data grids
- ✔️ Rule Builder (dropdown + natural language)
- ✔️ Prioritization with weight sliders
- ✔️ Export cleaned data + rules

---

## 📦 Deployment

Deployed at:

```plaintext
https://<your-vercel-url>.vercel.app
```

---

## 🧠 Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- papaparse / sheetjs
- json2csv

---

## 👤 Author

- Nikhil Bn

---

## 🔥 License

MIT License

---
