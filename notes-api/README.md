# Notes App - Spring Boot Backend

A RESTful API backend for the Notes application built with Spring Boot and PostgreSQL.

## Features

- User authentication (Email/Password and Anonymous)
- JWT-based authorization
- CRUD operations for notes
- PostgreSQL database
- CORS enabled for frontend integration
- Input validation
- Global exception handling

## Tech Stack

- Java 17
- Spring Boot 3.2.1
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (JSON Web Tokens)
- Lombok
- Maven

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Database Setup

1. Install PostgreSQL and create a database:

```sql
CREATE DATABASE notesdb;
```

2. Update `application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notesdb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Update `application.properties` with your configuration
4. Build the project:

```bash
mvn clean install
```

5. Run the application:

```bash
mvn spring-boot:run
```

The server will start at `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/signin` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/anonymous` - Sign in anonymously (no body required)

- `GET /api/auth/me` - Get current user info (requires authentication)

### Notes (All require authentication)

- `GET /api/notes` - Get all notes for current user

- `GET /api/notes/{id}` - Get specific note

- `POST /api/notes` - Create new note
  ```json
  {
    "title": "My Note",
    "content": "Note content here"
  }
  ```

- `PUT /api/notes/{id}` - Update note
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```

- `DELETE /api/notes/{id}` - Delete note

## Authentication

The API uses JWT for authentication. After signing in, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
src/main/java/com/notes/
├── config/
│   └── SecurityConfig.java          # Security configuration
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   └── NoteController.java          # Notes CRUD endpoints
├── dto/
│   ├── SignUpRequest.java
│   ├── SignInRequest.java
│   ├── AuthResponse.java
│   ├── UserResponse.java
│   ├── NoteRequest.java
│   └── NoteResponse.java
├── entity/
│   ├── User.java                    # User entity
│   └── Note.java                    # Note entity
├── exception/
│   └── GlobalExceptionHandler.java  # Global exception handling
├── repository/
│   ├── UserRepository.java
│   └── NoteRepository.java
├── security/
│   ├── JwtUtil.java                 # JWT utility
│   ├── JwtAuthenticationFilter.java # JWT filter
│   └── CustomUserDetailsService.java
├── service/
│   ├── AuthService.java             # Authentication logic
│   └── NoteService.java             # Notes business logic
└── NotesApplication.java            # Main application class
```

## Configuration

Key configuration properties in `application.properties`:

- `jwt.secret` - Secret key for JWT (change in production!)
- `jwt.expiration` - Token expiration time (default: 24 hours)
- `cors.allowed-origins` - Allowed CORS origins (update for your frontend URL)

## Security

- Passwords are encrypted using BCrypt
- JWT tokens expire after 24 hours (configurable)
- CORS is configured for specified origins
- All note endpoints require authentication
- Users can only access their own notes

## Development

To run in development mode with auto-reload:

```bash
mvn spring-boot:run
```

## Testing

Run tests with:

```bash
mvn test
```

## Building for Production

1. Update `application.properties` with production settings
2. Change the JWT secret to a secure random string
3. Build the JAR:

```bash
mvn clean package
```

4. Run the JAR:

```bash
java -jar target/notes-api-1.0.0.jar
```

## Frontend Integration

This backend is designed to work with the React frontend. Update the frontend API base URL to point to this backend:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Troubleshooting

- **Database connection issues**: Verify PostgreSQL is running and credentials are correct
- **CORS errors**: Update `cors.allowed-origins` in `application.properties`
- **Port conflict**: Change `server.port` in `application.properties`
- **JWT errors**: Ensure the secret key is at least 256 bits

## License

MIT License