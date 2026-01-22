# 🎓 Face Detection Attendance System
### Ultimate Setup Guide

Welcome to the **Face Detection Attendance System**! This guide will walk you through setting up this hybrid **Next.js + Python** application step-by-step.

---

## 🛠️ Prerequisites

Before we begin, ensure you have the following installed on your machine:

| Software | Version | Link |
| :--- | :--- | :--- |
| **Node.js** | `v18` or higher | [Download Node.js](https://nodejs.org/) |
| **Python** | `v3.10` or higher | [Download Python](https://www.python.org/) |
| **MongoDB** | Community / Atlas | [Download MongoDB](https://www.mongodb.com/try/download/community) |

> **⚠️ Important:** During Python installation, ensure you check the box **"Add Python to PATH"**.

---

## 🚀 Installation

### Step 1: Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
git clone <your-repo-url>
cd face-detection-attedance-system
```

### Step 2: Configure Environment Variables
Create a file named `.env.local` in the root directory. This connects your app to the database.

**Copy & Paste this into `.env.local`:**
```properties
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/attendance_system

# OR use MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance_system
```

---

## 🐍 Python Backend Setup
This project uses a Python backend for heavy AI processing (Face Recognition).

### 1. Create Virtual Environment
Run the following command based on your OS:

**Windows:**
```powershell
python -m venv scripts/venv
```

**Mac / Linux:**
```bash
python3 -m venv scripts/venv
```

### 2. Activate & Install Dependencies
**Windows:**
```powershell
.\scripts\venv\Scripts\activate
pip install -r scripts/requirements.txt
```

**Mac / Linux:**
```bash
source scripts/venv/bin/activate
pip install -r scripts/requirements.txt
```
> ☕ **Grab a coffee!** This will install `tensorflow`, `deepface`, and `opencv`. It might take 2-5 minutes.

---

## ⚡ Node.js Frontend Setup
Now, let's install the web application libraries. Open a **New Terminal** (keep the Python one open if you want) and run:

```bash
npm install
```

---

## ▶️ Running the Application

You are now ready to launch! 🚀

Run this single command to start everything:
```bash
npm run dev
```

Open your browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧭 Navigation Guide

| Page | URL | Description |
| :--- | :--- | :--- |
| **Admin Dashboard** | `/admin` | Register new students & teachers. Delete users. |
| **Teacher Dashboard** | `/teacher` | Start live camera & mark attendance. |
| **Student Dashboard** | `/student` | View attendance stats & profile. |

---

## 🆘 Troubleshooting & FAQ

<details>
<summary><strong>❌ Error: "spawn python ENOENT"</strong></summary>

**Cause:** The application cannot find Python.
**Fix:** 
1. Make sure you created the `venv` folder in `scripts/venv`.
2. Ensure you installed Python and added it to PATH.
</details>

<details>
<summary><strong>⏳ Stuck on "Downloading Facenet..."</strong></summary>

**Cause:** The first time you scan a face, the AI model (~100MB) needs to download.
**Fix:**
Just wait! It only happens once. Check your terminal for download progress bars.
</details>

---

*Made with ❤️ for the Attendance Project.*
