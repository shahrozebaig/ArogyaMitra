## System Architecture
```mermaid
graph TD
    User((User)) -->|Interacts| ReactApp[React Frontend]
    ReactApp -->|REST API| FastAPI[FastAPI Backend]
    
    subgraph "Internal Processing"
        FastAPI -->|Queries| MongoDB[(MongoDB Atlas)]
        FastAPI -->|Analysis| Groq[Groq AI]
        ReactApp -->|Computer Vision| MediaPipe[MediaPipe Tracking]
    end
    
    subgraph "External Integrations"
        FastAPI -->|Video Sync| YouTube[YouTube API]
        ReactApp -->|Shopping| BigBasket[BigBasket Integration]
    end
```

---

## Backend System Flow
```mermaid
graph TD
    A[Client Request] --> B[FastAPI Router]
    B --> C{Auth Middleware}
    C -->|Unauthorized| D[401 Error]
    C -->|Authorized| E[Service Layer]
    
    E --> F{Feature Logic}
    
    F -->|Workout/Nutrition| G[Groq AI Service]
    F -->|Data Management| H[Motor / MongoDB]
    F -->|External Media| I[YouTube / Spoonacular APIs]
    
    G --> J[AI Response Parser]
    J --> K[Formatted Response]
    
    H --> L[DB Record]
    L --> K
    
    I --> M[External Data]
    M --> K
    
    K --> N[Client Response]
```

---

## Frontend System Flow
```mermaid
graph TD
    A[User Action] --> B[React Components]
    B --> C{State Manager - Zustand}
    
    C -->|Session Data| D[LocalStorage]
    C -->|API Call| E[Axios Client]
    
    E --> F[FastAPI Backend]
    F -->|JSON Response| E
    
    E --> G[State Update]
    G --> B
    
    B --> H{Route Handler}
    H -->|Protected| I[Auth Wrapper]
    H -->|Public| J[View Component]
    
    I -->|Logged In| J
    I -->|Logged Out| K[Login Page]
```

---

## Database Relationship Diagram (ERD)
```mermaid
erDiagram
    users ||--o| health_profiles : "has"
    users ||--o{ workouts : "generates"
    users ||--o{ nutrition : "generates"
    users ||--o{ progress : "records"

    users {
        string id PK
        string name
        string email
        string password
    }

    health_profiles {
        string id PK
        string user_id FK
        int age
        float height
        float weight
        string gender
        string fitness_goal
        string fitness_level
        string workout_location
    }

    workouts {
        string id PK
        string user_id FK
        string title
        string goal
        int duration
        string plan_json
        string created_at
    }

    nutrition {
        string id PK
        string user_id FK
        int calories
        string diet_type
        string plan_json
        string created_at
    }

    progress {
        string id PK
        string user_id FK
        float weight
        float calories_burned
        int workout_completed
        string status
        string created_at
    }


```

---

## Backend API Endpoints 
```mermaid
mindmap
  root((FastAPI Backend))
    Auth
      /auth/register
      /auth/login
    Health
      /health/assessment
      /health/profile
      /health/profile/update
      /health/reset
    Workout
      /workout/generate
      /workout/current
    Nutrition
      /nutrition/generate
      /nutrition/current
    Progress
      /progress/stats
      /progress/update
    AI Coach
      /aromi/chat
```