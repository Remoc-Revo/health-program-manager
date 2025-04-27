# Health Program Manager
A simple web application for managing clients, programs, and their enrollments.
Built with Next.js, Tailwind CSS and MySQL.

## Features
- Create and manage health programs

- Register clients

- Register Programs

- Enroll clients into programs

- Search for clients

- Access client profiles via API


## Technologies Used
- Next.js (Front-end and API routes)
- Tailwind CSS
- MySQL


## Project Structure
```
src/
├── app/                      # Front-end pages and API routes
│   ├── api/                  # Backend API endpoints
│   │   ├── client-profile/
│   │   │   └── route.js       # API route to get or update a client's profile
│   │   ├── clients/
│   │   │   └── route.js       # API route for client CRUD operations
│   │   ├── enrollments/
│   │   │   └── route.js       # API route for enrolling clients into programs
│   │   ├── programs/
│   │   │   └── route.js       # API route for program CRUD operations
│   ├── client-profile/
│   │   └── page.js            # Front-end page displaying a client profile
│   ├── clients/
│   │   └── page.js            # Front-end page listing all clients
│   ├── programs/
│   │   └── page.js            # Front-end page listing all programs
│   ├── layout.js              # Main layout file (common structure for all pages)
│   └── page.js                # Home page (redirects to programs page)
├── components/                # Reusable UI components
│   └── Header.js              # Navigation header component
└── lib/                       # Utility functions and external libraries
    └── db.js                  # Database connection setup for MySQL

```


## Database Schema

```sql
CREATE TABLE client (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE program (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);


CREATE TABLE enrollment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  program_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES client(id),
  FOREIGN KEY (program_id) REFERENCES program(id)
);
```


## Setup Instructions
1. Clone the repository.

2. Install dependencies:
```bash
npm install
```

3. Create a .env file at the project root:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB=health-program-manager
```

4. Run the development server:
```
 npm run dev 
```

5. Open http://localhost:3000 in your browser.



## API Documentation

### Client Profile API for external services

#### Fetch a client profile by Email or Phone

**Endpoint:**  
```http
GET /api/client-profile
```

**Query Parameters:**

| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| `email`   | string | No       | Email address of the client         |
| `phone`   | string | No       | Phone number of the client          |

- You must provide either `email` **or** `phone`.
- If both are provided, `email` will be prioritized.

---

### Example Requests

**Search by Email**
```http
GET /api/client-profile?email=tim@example.com
```

**Search by Phone**
```http
GET /api/client-profile?phone=0769658733
```

**Example Successful Response (200 OK)**
```json
{
  "id": 1,
  "full_name": "Tim Ng'uono",
  "phone": "0769658733",
  "email": "tim@example.com",
  "created_at": "2024-04-26T10:00:00.000Z",
  "enrolledPrograms": [
    {
      "id": 1,
      "name": "Malaria Program",
    },
    {
      "id": 2,
      "name": "Diabetes Management",
    }
  ]
}
```
