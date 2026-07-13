# spring-redis-url-shortener

A URL shortening service built with Spring Boot, Redis OM Spring, and React.

## Tech Stack

| Layer | Technology |
|---|---|
| API | Spring Boot 4.x, Spring Web MVC |
| Persistence | Redis (via Redis OM Spring) |
| Frontend | React 19, React Router 7, Vite |
| Testing (API) | JUnit 5, Mockito, MockMvc |
| Testing (UI) | Vitest, React Testing Library |

## Prerequisites

- Java 17+
- Maven
- Redis (running locally on the default port `6379`)
- Node.js 18+

## Project Structure

```
src/
├── main/
│   ├── java/com/example/url_shortener/
│   │   ├── controllers/        # REST endpoints + global exception handler
│   │   ├── domain/             # Url document, ShortenRequest DTO
│   │   ├── exceptions/         # UrlNotFoundException, UrlAlreadyExistsException
│   │   ├── repository/         # UrlRepository (RedisDocumentRepository)
│   │   └── utils/              # IdGenerator (Base62, SHA-256)
│   └── webapp/                 # React frontend
│       ├── components/         # ShortenForm, UrlResult, StatsView
│       └── api/                # urlService.js (fetch wrappers)
└── test/                       # Java unit + slice tests
```

## Getting Started

### 1. Start Redis

```bash
redis-server
```

### 2. Run the API

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

### 3. Run the Frontend

```bash
cd src/main/webapp
npm install
npm run dev
```

The frontend starts on `http://localhost:3000`.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/shorten` | Shorten a URL |
| `GET` | `/{id}` | Resolve a short code to the original URL |
| `DELETE` | `/{id}` | Delete a short URL |
| `GET` | `/stats/{id}` | Get click count and metadata for a short URL |

### Example

```bash
# Shorten a URL
curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.example.com"}'

# Response
{"id": "aB3xYz"}

# Resolve it
curl http://localhost:8080/aB3xYz
{"originalUrl": "https://www.example.com"}

# Get stats
curl http://localhost:8080/stats/aB3xYz
{"id": "aB3xYz", "originalUrl": "https://www.example.com", "clickCount": 0, "createdAt": "..."}
```

## Running Tests

### API tests

```bash
mvn test
```

### Frontend tests

```bash
cd src/main/webapp
npm test
```

