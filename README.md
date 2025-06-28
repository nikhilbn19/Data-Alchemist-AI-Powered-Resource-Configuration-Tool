
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
https://data-alchemist-ai-powered-resource.vercel.app/
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


![Screenshot 2025-06-28 075322](https://github.com/user-attachments/assets/c6855ba0-7deb-440a-8d06-af5f46cfe743)
![Screenshot 2025-06-28 075340](https://github.com/user-attachments/assets/6231bb1b-467e-4f7b-99bb-457aadf3c4d2)
![Screenshot 2025-06-28 075352](https://github.com/user-attachments/assets/c3b027bd-f953-4069-908a-d83c46fdbd98)
![Screenshot 2025-06-28 075412](https://github.com/user-attachments/assets/dfef46e1-c003-4764-b0c8-938c13254858)





