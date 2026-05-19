# NoorAcademy — Frontend

This folder contains all the frontend pages, styles, and scripts for the NoorAcademy Quran Teaching Platform.

## Structure

```
frontend/
├── index.html               ← Home / Landing page
├── login.html               ← Login page
├── signup.html              ← Registration page
├── chatboot.html            ← AI Chat assistant
├── dashboard-admin.html     ← Admin dashboard
├── dashboard-teacher.html   ← Teacher portal
├── dashboard-student.html   ← Student dashboard
├── dashboard-parent.html    ← Parent dashboard
├── css/
│   ├── style.css            ← Main design system styles
│   ├── auth.css             ← Login/signup styles
│   └── animations.css       ← Animation utilities
├── js/
│   ├── main.js              ← Core app logic & API calls
│   ├── data.js              ← Static data & content
│   └── animations.js        ← Animation handlers
└── config.json              ← Frontend configuration
```

## How to Run

Since this is a plain HTML/CSS/JS frontend, you can open any page directly in a browser.

**Recommended**: Use a local server to avoid CORS issues:

```bash
# Using VS Code Live Server extension (recommended)
# OR using npx:
npx -y serve .
```

Then open: `http://localhost:3000`

## API Connection

The frontend connects to the **Node.js backend** running at `http://localhost:4000`.

Make sure the backend is running before testing authenticated pages (dashboards).

See `../backend/README.md` for backend setup instructions.
