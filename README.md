# Multi-Tenant Project Management

Allowing organizations related Projects, tasks, and comments, with data isolation per tenant.

---

## 📦 Tech Stack

- **Backend:** Django 4.x, Graphene (GraphQL), Django REST Framework, PostgreSQL
- **Frontend:** React 18+, TypeScript, Apollo Client, TailwindCSSManagement
- **Database:** PostgreSQL (local)

---

## ⚙️ Backend Setup (Django)

### 1. Clone the repository and navigate to backend folder

git clone <https://github.com/ErRohitM/multi-tenant-project-management.git>

cd backend

### 2. Set up Python environment and install dependencies

python3 -m venv venv(linux)

source venv/bin/activate

pip install -r requirements.txt

### 3. Create a PostgreSQL database

Create a new PostgreSQL database locally.
Update the .env file in the backend/ folder accordingly:

DEBUG=True
SECRET_KEY=your_secret_key

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

### 4. Apply migrations and seed sample data

python manage.py makemigrations

python manage.py migrate

## seeds sample data for testing

python manage.py create_sample_data.py 

### 5. Start the development server

python manage.py runserver

Backend GraphQL endpoint: <http://localhost:8000/graphql/>

🌐 Frontend Setup (React)

### 1. Navigate to frontend and install dependencies

cd frontend

npm install (required)

### 2. Start the frontend development server

npm run dev

locate <http://localhost:5173/> in browser

Uploading simplescreenrecorder-2025-08-27_14.15.37.mp4…

