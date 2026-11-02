# Library Book Management System

A full-stack, responsive, and production-ready **Library Book Management System** built with **React.js** for the frontend, **Java 21 & Spring Boot 3** for the REST API backend, and **MySQL 8** for persistent database storage.

---

## 1. Project Overview

The Library Book Management System allows librarians to manage an institutional book collection seamlessly. Key capabilities include:

- **Dashboard Overview**: Dynamically calculated library statistics:
  - Total Books
  - Available Books
  - Issued Books
  - Total Distinct Categories
- **Add Book Record**: Validated form with unique `Book ID`, title, author, selectable categories, and availability status. Prevents duplicates with clear error notifications.
- **Display All Books**: Responsive, clean data table with book badges, status badges (Green for `Available`, Orange for `Issued`), pagination, and quick actions.
- **Live Search**: Instant case-insensitive search by book title or author name with clear button and empty states.
- **Edit Book Details**: Update title, author, category, and status while keeping the `Book ID` fixed to maintain identity integrity.
- **Delete Book Record**: Safe deletion with a confirmation dialog showing the book's title to prevent accidental loss.
- **Instant Availability Toggle**: Single-click switch between `Available` and `Issued` with immediate database persistence and live dashboard metric recalculation.
- **Robust Error Handling**: Frontend toast notifications and centralized backend global exception handling (`@RestControllerAdvice`).

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: Modern, responsive CSS3 with CSS custom properties (Navy `#0F172A`, Royal Blue `#1E3A8A`, Light Gray `#F8FAFC`)
- **HTTP Client**: Axios with centralized error handling & base URL configuration
- **Icons**: Lucide React
- **Port**: `5173`

### Backend
- **Platform**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.4
- **Modules**:
  - `spring-boot-starter-web` (REST APIs)
  - `spring-boot-starter-data-jpa` (Hibernate ORM & Repositories)
  - `spring-boot-starter-validation` (Jakarta Bean Validation)
  - `mysql-connector-j` (MySQL 8 Driver)
  - `spring-boot-starter-test` (JUnit 5 & Mockito)
- **Build Tool**: Apache Maven
- **Port**: `8080`

### Database
- **Engine**: MySQL 8.x
- **Database Name**: `library_db`
- **Table Name**: `books`

---

## 3. Project Architecture & Folder Structure

```
library-book-management2/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/library/bookmanagement/
│       │   │   ├── LibraryBookManagementApplication.java
│       │   │   ├── entity/
│       │   │   │   └── Book.java
│       │   │   ├── repository/
│       │   │   │   └── BookRepository.java
│       │   │   ├── service/
│       │   │   │   ├── BookService.java
│       │   │   │   └── impl/
│       │   │   │       └── BookServiceImpl.java
│       │   │   ├── controller/
│       │   │   │   └── BookController.java
│       │   │   ├── dto/
│       │   │   │   ├── BookRequestDto.java
│       │   │   │   ├── BookResponseDto.java
│       │   │   │   ├── BookUpdateRequestDto.java
│       │   │   │   ├── StatusUpdateRequestDto.java
│       │   │   │   ├── DashboardStatsDto.java
│       │   │   │   └── ErrorResponseDto.java
│       │   │   └── exception/
│       │   │       ├── DuplicateBookIdException.java
│       │   │       ├── ResourceNotFoundException.java
│       │   │       ├── InvalidInputException.java
│       │   │       └── GlobalExceptionHandler.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/com/library/bookmanagement/
│               └── BookServiceTest.java
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── DashboardCards.jsx
│       │   ├── BookTable.jsx
│       │   ├── BookForm.jsx
│       │   ├── SearchBar.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── ConfirmDialog.jsx
│       │   ├── Toast.jsx
│       │   └── Pagination.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   └── Books.jsx
│       └── services/
│           ├── api.js
│           └── bookService.js
├── sample-requests.http
└── README.md
```

---

## 4. Database Schema

The database table `books` is automatically generated and managed by Spring Data JPA with Hibernate:

```sql
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT uk_books_book_id UNIQUE (book_id)
);
```

### Constraints & Valid Values
- `book_id`: Unique business identifier (e.g., `BK101`). Cannot be duplicated.
- `title`: Non-empty, max 255 characters.
- `author`: Non-empty, max 150 characters.
- `category`: Fiction, Non-Fiction, Science, Technology, History, Mathematics, Literature, Biography, Other.
- `status`: Either `AVAILABLE` or `ISSUED`.

---

## 5. Backend REST API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/api/books` | Add a new book | `201 Created` / `409 Conflict` / `400 Bad Request` |
| `GET` | `/api/books` | Retrieve all books (ordered by latest) | `200 OK` |
| `GET` | `/api/books/{id}` | Get book by primary key ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/books/{id}` | Update book details (keeps `bookId` fixed) | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/books/{id}` | Delete a book record | `204 No Content` / `404 Not Found` |
| `GET` | `/api/books/search?query={keyword}` | Search books by title or author | `200 OK` |
| `PATCH` | `/api/books/{id}/status` | Change status (`AVAILABLE` / `ISSUED`) | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `GET` | `/api/books/stats` | Dynamic dashboard statistics | `200 OK` |

---

## 6. Step-by-Step Setup & Execution Instructions (Windows)

### Prerequisites
Ensure the following tools are installed on your machine:
- **Java 21**: Verify via `java -version`
- **Apache Maven 3.8+**: Verify via `mvn -version`
- **Node.js (v18+) & npm**: Verify via `node -v` and `npm -v`
- **MySQL Server 8.x**: Verify via `mysql --version`

---

### Step 1: Configure & Start MySQL

1. Open PowerShell or Command Prompt.
2. Log into MySQL:
   ```powershell
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS library_db;
   SHOW DATABASES LIKE 'library_db';
   EXIT;
   ```
4. Verify or update MySQL credentials in:
   `backend/src/main/resources/application.properties`
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   *(Change password if your MySQL root user has a different password)*.

---

### Step 2: Build and Run the Backend

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Run unit and integration tests:
   ```powershell
   mvn clean test
   ```
3. Start the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
4. The backend server will start at:
   `http://localhost:8080`
   Verify by opening `http://localhost:8080/api/books/stats` in your browser. It should return:
   ```json
   {
     "totalBooks": 0,
     "availableBooks": 0,
     "issuedBooks": 0,
     "totalCategories": 0
   }
   ```

---

### Step 3: Configure and Run the Frontend

1. Open a **new terminal window** and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
2. Verify that `.env` exists:
   ```properties
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
3. Install frontend dependencies:
   ```powershell
   npm install
   ```
4. Start the Vite React development server:
   ```powershell
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 7. Sample Book Records (Development Test Data)

You can add these sample books via the frontend UI by clicking **"+ Add New Book"**, or via the provided `sample-requests.http` file:

| Book ID | Title | Author | Category | Status |
|---------|-------|--------|----------|--------|
| **BK101** | Wings of Fire | A.P.J. Abdul Kalam | Biography | AVAILABLE |
| **BK102** | The Alchemist | Paulo Coelho | Fiction | ISSUED |
| **BK103** | Introduction to Algorithms | Thomas H. Cormen | Technology | AVAILABLE |
| **BK104** | A Brief History of Time | Stephen Hawking | Science | AVAILABLE |
| **BK105** | The Discovery of India | Jawaharlal Nehru | History | ISSUED |

---

## 8. Verifying Required Features

1. **Add Book**:
   - Click `+ Add New Book`.
   - Enter `BK101`, `Wings of Fire`, `A.P.J. Abdul Kalam`, `Biography`, `Available`.
   - Click `Add Book`. The toast "Book added successfully." appears, the table updates, and dashboard stats increment dynamically.
2. **Duplicate Book ID Prevention**:
   - Click `+ Add New Book` again.
   - Enter `BK101` and submit.
   - The form immediately displays the validation message: `"A book with this ID already exists."`
3. **Instant Search**:
   - Type `"Algorithms"` in the search bar. The table updates instantly showing only matching titles or authors.
   - Type `"Unknown"` to see the `"No books found"` empty state.
   - Click `✕` to clear the search and restore the full list.
4. **Edit Book Details**:
   - Click `Edit` on any book.
   - Notice the `Book ID` is fixed and disabled. Change the title or author and click `Save Changes`.
   - Success toast appears and changes persist in MySQL.
5. **Change Book Availability**:
   - Click the `Issue` button beside an available book.
   - Status instantly changes to `Issued` (amber badge), and the `Issued Books` counter increments in the dashboard.
   - Click `Return` to toggle it back to `Available` (green badge).
6. **Delete Book Record**:
   - Click `Delete` on a book row.
   - Confirmation dialog opens: `"Are you sure you want to delete this book? This action cannot be undone."` with the title highlighted.
   - Confirm deletion. Toast "Book deleted successfully." appears and statistics update.
7. **Persistence Verification**:
   - Restart both backend and frontend. All records remain intact in MySQL!

---

## 9. Troubleshooting Common Issues

| Issue | Cause | Solution |
|---|---|---|
| `Access denied for user 'root'@'localhost'` | Incorrect MySQL password | Check your MySQL root password and update `spring.datasource.password` in `backend/src/main/resources/application.properties`. |
| `Communications link failure` | MySQL service is not running | Open Windows Services (`services.msc`) or run `Start-Service MySQL84` in PowerShell. |
| `Port 8080 already in use` | Another process is using port 8080 | Change `server.port=8081` in `application.properties` and update `VITE_API_BASE_URL=http://localhost:8081/api` in `frontend/.env`. |
| `CORS error in browser console` | Missing or mismatched CORS headers | `BookController.java` is annotated with `@CrossOrigin(origins = "*", ...)` allowing requests from any frontend port. |
| `Unable to connect to the server` | Backend is stopped | Ensure the Spring Boot backend is actively running on `http://localhost:8080`. |

