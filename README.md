# NutriVision MVP

NutriVision is a full-stack MVP web app for AI-assisted food logging. Users can register, upload meal photos, estimate nutrition from images, view rich dashboard analytics, browse meal history, and calculate BMI.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Recharts
- Backend: FastAPI + SQLAlchemy + JWT auth
- Database: SQLite
- AI: OpenAI Vision-compatible flow with a mock fallback for local development

## Folder Structure

```text
NutriLen/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── bmi.py
│   │   │   └── meals.py
│   │   ├── services/
│   │   │   └── nutrition_ai.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── seed_data.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload
```

Optional environment variables:

```bash
set OPENAI_API_KEY=your_key_here
set OPENAI_VISION_MODEL=gpt-4.1-mini
set JWT_SECRET_KEY=replace-me
```

If `OPENAI_API_KEY` is missing, uploads still work using built-in mock nutrition analysis based on the filename.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` and expects the backend on `http://127.0.0.1:8000`.

## Demo Credentials

- Email: `demo@nutrivision.app`
- Password: `demo1234`

## API Endpoints

- `POST /register`
- `POST /login`
- `POST /upload-meal`
- `GET /meals?period=day|week|month|all`
- `GET /stats`
- `POST /bmi`

## Example API Responses

### `POST /login`

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "demo@nutrivision.app",
    "daily_calorie_goal": 2300,
    "created_at": "2026-04-02T05:20:00.000000"
  }
}
```

### `POST /upload-meal`

```json
{
  "id": 7,
  "food_name": "Paneer Butter Masala",
  "quantity": "1 serving",
  "calories": 350,
  "carbs": 20,
  "protein": 12,
  "fats": 25,
  "image_path": "/uploads/abc123.jpg",
  "created_at": "2026-04-02T06:30:00.000000"
}
```

### `GET /stats`

```json
{
  "summary": {
    "calories": 1080,
    "carbs": 80,
    "protein": 62,
    "fats": 56,
    "goal": 2300,
    "goal_progress": 0.47,
    "remaining_calories": 1220,
    "exceeded": false
  },
  "macro_distribution": [
    { "name": "Carbs", "value": 80 },
    { "name": "Protein", "value": 62 },
    { "name": "Fats", "value": 56 }
  ],
  "daily_calorie_bars": [
    { "label": "Fri", "calories": 780, "carbs": 66, "protein": 34, "fats": 33 }
  ],
  "weekly_trend": [
    { "label": "01 Apr", "calories": 780, "carbs": 66, "protein": 34, "fats": 33 }
  ],
  "monthly_trend": [
    { "label": "Apr 2026", "calories": 1920, "carbs": 146, "protein": 92, "fats": 81 }
  ],
  "notifications": [
    "You are on track. Log your next meal to keep the streak going."
  ]
}
```

### `POST /bmi`

```json
{
  "bmi": 23.5,
  "category": "Normal",
  "healthy_range": "18.5 - 24.9"
}
```

## Dummy Test Data

- `python backend/seed_data.py` creates a demo user plus six meals spread across recent days.
- Uploading files named like `paneer.jpg`, `pizza.jpg`, `salad.jpg`, or `breakfast.jpg` triggers consistent mock nutrition estimates when no AI key is configured.

## Notes

- Rich dashboard includes macro pie chart, daily calorie bar graph, weekly trend, monthly trend, progress indicator, and calorie-goal notifications.
- Meal history supports day, week, month, and all filters.
- Dark/light mode toggle is built into the app shell.
- The ORM layer is structured so SQLite can be swapped for PostgreSQL later with limited changes.
