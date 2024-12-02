Emergency Management System (EMS) with FastAPI
Overview
The Emergency Management System (EMS) is a web application created using FastAPI, designed to manage emergencies effectively. It offers features like user registration, authentication, emergency logging, and analytics for better tracking and decision-making. It utilizes SQLAlchemy for database management and JWT tokens for secure authentication.
Key Features
    • User Management: Handle user registration, login, and role-based access control (RBAC) to assign roles like admin or responder. 
    • Emergency Handling: Log emergencies, assign responders, monitor response times, and update emergency statuses. 
    • Analytics: Gain insights into emergency types, frequencies, and other metrics to aid decision-making. 
    • Secure Authentication: Use JWT for protecting endpoints and ensuring only authorized access. 
    • Data Analysis: Integrates with pandas for comprehensive data analysis and reporting. 

Installation Guide
Step 1: Clone the Repository

Clone the project repository to your local machine:
git clone https://github.com/Elissa100/EmergencyResponseManagementSystem-fastapi.git
cd EmergencyResponseManagementSystem-fastapi

Step 2: Set Up a Virtual Environment

Create and activate a virtual environment to isolate dependencies.
For Linux/Mac:
python3 -m venv env
source env/bin/activate
For Windows:
python -m venv env
env\Scripts\activate

Step 3: Install Dependencies

Install the required backend libraries:
pip install -r requirements.txt
Step 4: Start the Backend Server
Run the backend server using uvicorn:
uvicorn main:app --reload
The backend API will be available at http://localhost:8000.

Frontend Setup

Step 1: Navigate to the Frontend Directory

Move to the frontend directory:
cd frontend

Step 2: Install Frontend Dependencies

Install the necessary frontend dependencies using npm or yarn:
npm install

Step 3: Launch the Frontend Server

Start the frontend development server:
npm start
The frontend will be accessible at http://localhost:3000 
How to Use
1. Authenticate with JWT
To use protected endpoints (e.g., user management or emergency logging), authenticate using JWT tokens:
    1. Obtain a Token: Use the /login endpoint with valid credentials (email and password) to get a JWT token. 
    2. Include the Token: Add the JWT token to the Authorization header in your requests: 
       Authorization: Bearer YOUR_JWT_TOKEN
2. Make API Requests
With the JWT token, you can access various endpoints:
    • GET /users: Retrieve a list of users. 
    • POST /emergencies: Log a new emergency. 
Ensure your requests include the JWT token in the header to access these routes.

This system combines efficiency, security, and insights to make emergency management streamlined and effective.

