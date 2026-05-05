<p align="center">
  <img src="frontend/public/Title.png" width="400" alt="ArogyaMitra Logo" />
</p>

---

## Project Overview
ArogyaMitra is an AI-powered fitness and wellness platform designed to deliver personalized health
guidance through intelligent workout planning, nutrition recommendations, and real-time wellness
support. Built using FastAPI (backend) and React (frontend), the platform leverages Groq’s
LLaMA-3.3-70B Versatile model to generate human-like coaching and customized fitness plans
suited to each individual’s lifestyle, preferences, and health profile.
The system analyzes user fitness levels, health conditions, medical history, and goals to generate
personalized 7-day workout routines, tailored meal plans, dynamic suggestions, and progress
insights. Users can engage with AROMI, an interactive AI coach that adapts workout schedules
based on travel, injuries, mood, or time availability.
Through continuous tracking and adaptive recommendations, ArogyaMitra empowers users to
maintain consistency, improve overall wellness, and stay motivated using gamified charity
contributions linked to fitness achievements.

---

## Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js | Core UI library. |
| **Backend** | Python / FastAPI | Asynchronous high-performance API. |
| **Database** | SQLite | Relational data persistence. |
| **AI Engine** | Groq / Google Gemini | Powering AROMI Coach & Plan Generation. |
| **Vision Tracking** | MediaPipe | Real-time exercise rep counting. |

---

## API Reference (Unified Table)

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Register a new account. |
| **Auth** | `POST` | `/auth/login` | Authenticate & get session. |
| **Health** | `POST` | `/health/assessment` | Submit physiological data. |
| **Health** | `GET` | `/health/profile` | Retrieve user health stats. |
| **Health** | `POST` | `/health/profile/update` | Update user metrics. |
| **Health** | `POST` | `/health/reset` | Clear all account data. |
| **Workout** | `POST` | `/workout/generate` | Create AI workout plan. |
| **Workout** | `GET` | `/workout/current` | Get active workout plan. |
| **Nutrition** | `POST` | `/nutrition/generate` | Create AI nutrition plan. |
| **Nutrition** | `GET` | `/nutrition/current` | Get active nutrition plan. |
| **Progress** | `GET` | `/progress/stats` | Retrieve activity logs. |
| **Progress** | `POST` | `/progress/update` | Log exercise or meal. |
| **AI Coach** | `POST` | `/aromi/chat` | Chat with AROMI AI. |

---

## Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `Required` | API Key for AI generation services. |
| `YOUTUBE_API_KEY` | `Optional` | API Key for workout video fetching. |
| `JWT_SECRET_KEY` | `Generated` | Secret key for token encryption. |
| `JWT_ALGORITHM` | `HS256` | Hashing algorithm for auth tokens. |

---

## Conclusion

ArogyaMitra successfully brings together AI intelligence, personalized fitness planning, and modern wellness principles into a unified, user-friendly platform. By integrating Groq’s advanced LLaMA model, the system generates tailored workout routines, nutrition plans, and real-time adaptive coaching that respond dynamically to each user’s lifestyle, preferences, and health conditions. This ensures that every individual receives a fitness experience that is not only effective but also safe, relevant, and deeply personalized.

The platform’s modular architecture built with FastAPI, React, SQLAlchemy, YouTube API, Spoonacular, and Google Calendar creates a smooth and interactive end-to-end experience. Users can explore structured workout plans, follow guided exercise videos, maintain healthy eating habits, track their progress, and receive instant assistance from AROMI, the AI wellness coach. The inclusion of a charity-based gamification system adds motivation and a sense of social contribution, enhancing user engagement and consistency.

Through its seamless combination of technology, AI-driven insights, and holistic health features, ArogyaMitra stands as a complete wellness ecosystem designed to support long-term fitness transformation. The project demonstrates how intelligent systems can meaningfully improve personal health journeys by offering adaptive, real-time guidance and empowering users to build sustainable habits. As a scalable and future-ready platform, ArogyaMitra lays the foundation for advanced health innovations, such as wearable integrations, real-time analytics, and AI-assisted coaching at a global scale.