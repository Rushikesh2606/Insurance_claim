# Contributing to Insurance Claim Management System

🎉 First off, thanks for taking the time to contribute! Your help improves this project for everyone.

---

## 🧭 Overview

The **Insurance Claim Management System** is a full-stack web application built using:
- **Frontend:** React.js  
- **Backend:** Flask (Python)  
- **Database:** MongoDB  

The app allows claim managers to **view, add, edit, and delete** insurance claims, along with real-time statistics and a clean dashboard interface.

---

## 🧰 Development Setup

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/Insurance_claim.git
cd Insurance_claim
```

### 2. Backend Setup
Make sure you have Python 3.10+ and `pip` installed.

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# OR
source venv/bin/activate    # macOS/Linux

pip install -r requirements.txt
flask run
```

The Flask server runs at:  
➡️ `http://localhost:5000`

### 3. Frontend Setup
Ensure you have Node.js (v16+) and npm installed.

```bash
cd frontend
npm install
npm start
```

The frontend runs at:  
➡️ `http://localhost:3000`

---

## 🧩 Folder Structure

```
Insurance_claim/
│
├── backend/                # Flask API & routes
│   ├── app.py
│   ├── routes/
│   └── services/
│
├── frontend/               # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## ⚙️ Submitting a Pull Request

1. Create a new branch for your feature/fix:  
   ```bash
   git checkout -b feature/<your-feature-name>
   ```
2. Commit your changes with a descriptive message:  
   ```bash
   git commit -m "Added new feature: Claim deletion API"
   ```
3. Push your branch to your fork:  
   ```bash
   git push origin feature/<your-feature-name>
   ```
4. Open a Pull Request on GitHub 🎉

---

## 🧪 Code Style & Standards

- **Frontend:** Follow ESLint & Prettier rules.
- **Backend:** Use PEP8 style guidelines for Python.
- Write clear, meaningful commit messages.
- Add comments for non-trivial logic.

---

## 🧱 Contribution Ideas

- Add pagination or filtering in dashboard.
- Improve UI themes (Dark/Light mode).
- Add authentication with JWT.
- Write unit tests for backend services.
- Enhance documentation.

---

## 🫶 Code of Conduct

Please be respectful and constructive.  
See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) for more details.

---

## 💬 Need Help?

Feel free to open an issue or reach out in the discussions section.  
Happy coding 💻🚀
