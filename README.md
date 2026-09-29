# Game Store

Навчальний проєкт: Django REST Framework + React (Vite).

## Запуск сервера

```bash
cd server
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
copy .env.example .env         # Windows (macOS / Linux: cp .env.example .env)
```

Відкрийте файл `.env` і впишіть свій `SECRET_KEY`. Потім:

```bash
python manage.py migrate
python manage.py loaddata initial_data
python manage.py runserver
```

Сервер: http://127.0.0.1:8000/

## Запуск клієнта

```bash
cd client/app
yarn install
yarn dev
```

Клієнт: http://localhost:5173/
