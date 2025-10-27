# 🧾 Claim Management System

A full-stack web application built for managing insurance claims efficiently.  
It includes claim creation, viewing, editing, deleting, and analytics, with a modern responsive UI.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite / CRA), HTML5, CSS3 |
| **Backend** | Flask (Python) |
| **Database** | MongoDB |
| **Styling** | Custom CSS (Inter Font, responsive layout) |
| **Other Tools** | Node.js, npm, Git |

---

## 🏗️ Project Structure

```
project-root/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   │   └── claims_routes.py
│   ├── services/
│   │   └── claims_service.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ClaimDetails.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   └── styles/
│   │       ├── ClaimDetails.css
│   │       └── Dashboard.css
│   ├── package.json
│   ├── vite.config.js (or CRA files)
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2️⃣ Backend Setup (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate    # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt
python app.py
```

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

Then visit **http://localhost:5173** (or similar) to view the app.

---

## 🌟 Features

- 🧾 Create, view, edit, and delete claims  
- 📊 Dashboard for claim summaries and quick stats  
- 💬 Detailed claim info with export (print/PDF)  
- 🌈 Modern responsive UI with Inter font  
- 🔒 Secure backend API integration

---

## 🧠 Future Enhancements

- PDF export and download  
- Role-based access (Admin / Manager)  
- Charts & analytics dashboard  
- Email notifications on claim updates

---

## 🧑‍💻 Developer Info

**Author:** <Rushikesh-Suresh-Yadav>  
**GitHub:** [@your-username](https://github.com/Rushikesh2606)  
**License:** MIT
