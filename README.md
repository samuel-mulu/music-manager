# 🎵 Music Manager - Full Stack MERN Application

> A comprehensive music management system built with **MongoDB, Express.js, React.js & Node.js** - demonstrating full-stack development capabilities with real-time features and modern best practices.

## 🚀 Live Demo

| Service | Deployment | Link |
|----------|-------------|------|
| 🎨 **Frontend (React + TypeScript)** | ![Vercel](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel) | 🔗 [Open Frontend](https://music-manager-bay.vercel.app) |
| ⚙️ **Backend (Express + MongoDB)** | ![Render](https://img.shields.io/badge/Render-API--Live-blue?logo=render) | 🔗 [Open API](https://music-manager-1.onrender.com) |


---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)

---

## 🎯 Project Overview

This project demonstrates full-stack development expertise by implementing a complete music management system that allows users to **create, read, update, and delete** songs while viewing comprehensive statistics in real-time.

### Test Requirements Fulfilled ✅

**Backend Requirements:**

- ✅ REST API with full CRUD operations for songs
- ✅ Song model with Title, Artist, Album, and Genre
- ✅ Comprehensive statistics generation:
  - Total songs, artists, albums, and genres
  - Songs per genre with breakdown
  - Songs and albums per artist
  - Song type distribution
  - Recent activity tracking
  - Top performers and averages
- ✅ **Express.js** for request handling
- ✅ **MongoDB** for data storage
- ✅ **Mongoose** for data modeling and schema validation
- ✅ **Docker** containerization with docker-compose

**Frontend Requirements:**

- ✅ **TypeScript** with minimal use of `any` type
- ✅ **React.js** for UI components
- ✅ **Redux Toolkit** for state management
- ✅ **Redux-Saga** for API calls and side effects
- ✅ **Emotion & Styled System** for styling
- ✅ Real-time updates without page reload using **Socket.IO**
- ✅ List, create, update, and delete songs
- ✅ Comprehensive statistics dashboard

**Bonus Features:**

- ✅ Advanced filtering (genre, song type, album name, search)
- ✅ Sorting capabilities (title, artist, genre, date)
- ✅ **Hosted on Vercel** (frontend) and **Render** (backend)
- ✅ Real-time synchronization across multiple clients
- ✅ Responsive design for mobile and desktop

---

## ✨ Features

### 🎸 Song Management

- **Create** new songs with title, artist, album, and genre
- **View** songs in a beautiful, responsive grid layout
- **Update** song information with validation
- **Delete** songs with confirmation modal
- **Search** songs by title, artist, album, or genre
- **Filter** by genre, song type (single/album), and album name
- **Sort** by title, artist, genre, or creation date
- **Pagination** for efficient data loading

### 📊 Real-Time Statistics Dashboard

- **Total Counts**: Songs, artists, albums, genres
- **Genre Breakdown**: Songs per genre with percentages
- **Artist Breakdown**: Songs per artist with percentages
- **Song Type Distribution**: Singles vs album tracks
- **Recent Activity**: 5 most recently added songs
- **Top Performers**: Most popular genres and artists
- **Insights**: Average songs per artist and genre
- **Live Updates**: Statistics update instantly across all clients

### 🔄 Real-Time Synchronization

- Instant updates when songs are added, modified, or deleted
- No page reload required - changes appear immediately
- Socket.IO powered real-time communication
- Multi-client synchronization

---

## 🛠 Technology Stack

### Backend

| Technology     | Purpose                               |
| -------------- | ------------------------------------- |
| **Node.js**    | Runtime environment                   |
| **Express.js** | Web framework for REST API            |
| **TypeScript** | Type-safe code                        |
| **MongoDB**    | NoSQL database                        |
| **Mongoose**   | ODM for MongoDB                       |
| **Socket.IO**  | Real-time bidirectional communication |
| **Docker**     | Containerization                      |

### Frontend

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| **React 18**         | UI library              |
| **TypeScript**       | Type-safe code          |
| **Redux Toolkit**    | State management        |
| **Redux-Saga**       | Side effects management |
| **Emotion**          | CSS-in-JS styling       |
| **Styled System**    | Design system utilities |
| **Socket.IO Client** | Real-time updates       |
| **Axios**            | HTTP client             |

### DevOps & Deployment

- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Docker & Docker Compose** - Containerization

---

## 🏗 Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Client   │ ◄─────► │  Express API    │ ◄─────► │    MongoDB      │
│  (TypeScript)   │  HTTP   │  (TypeScript)   │         │                 │
│                 │ Socket  │                 │         └─────────────────┘
└─────────────────┘         └─────────────────┘
       │                            │
       │    Redux Toolkit           │
       │    Redux-Saga              │    Docker Container
       │    Emotion/Styled          │
       └────────────────────────────┘
              Real-time Updates
```

**Data Flow:**

1. User interacts with React UI
2. Redux action dispatched
3. Redux-Saga intercepts and calls API
4. Express handles request, updates MongoDB
5. Socket.IO broadcasts change to all clients
6. Redux store updates, UI re-renders

---

## 🚀 Getting Started


#### 1. Clone the Repository

cd music-manager
```

#### 2. Backend Setup

```bash
cd backend
npm install
```



Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
```



Start the frontend:

```bash
   npm start
```


### 🐳 Docker Installation (Alternative)

Run the entire backend stack with one command:

```bash
cd backend
docker-compose up --build
```


---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://music-manager-1.onrender.com`

### Endpoints

#### Songs

| Method   | Endpoint            | Description                                         |
| -------- | ------------------- | --------------------------------------------------- |
| `GET`    | `/api/v1/songs`     | Get all songs (with pagination, filtering, sorting) |
| `POST`   | `/api/v1/songs`     | Create a new song                                   |
| `GET`    | `/api/v1/songs/:id` | Get song by ID                                      |
| `PUT`    | `/api/v1/songs/:id` | Update song                                         |
| `DELETE` | `/api/v1/songs/:id` | Delete song                                         |

#### Statistics

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| `GET`  | `/api/v1/songs/stats`        | Get comprehensive statistics |
| `GET`  | `/api/v1/songs/stats/recent` | Get 5 most recent songs      |

### Query Parameters (GET /api/v1/songs)

```
?page=1                    # Page number
&limit=10                  # Items per page
&sort=title                # Sort by: title, artist, genre, -createdAt
&search=love               # Search term
&searchType=title          # Search in: title, artist, album, genre
&genre=Pop                 # Filter by genre
&songType=album            # Filter by type: single, album
&album=Greatest Hits       # Filter by album name
```


#### Create Song

**Request:**

```http
POST /api/v1/songs
Content-Type: application/json

{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "songType": "album",
  "genre": "Rock",
  "album": "A Night at the Opera"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "songType": "album",
    "genre": "Rock",
    "album": "A Night at the Opera",
    "createdAt": "2025-01-07T10:30:00.000Z",
    "updatedAt": "2025-01-07T10:30:00.000Z"
  }
}
```

#### Get Statistics

**Request:**

```http
GET /api/v1/songs/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totals": {
      "songs": 150,
      "artists": 45,
      "genres": 12,
      "singleSongs": 80,
      "albumSongs": 70
    },
    "distribution": {
      "songsPerGenre": [
        {
          "genre": "Rock",
          "totalCount": 45,
          "percentage": 30
        }
      ],
      "songsPerArtist": [
        {
          "artist": "Queen",
          "songCount": 12,
          "percentage": 8
        }
      ]
    }
  }
}
```

### Socket.IO Events

#### Client → Server

| Event              | Description                     |
| ------------------ | ------------------------------- |
| `join-songs-room`  | Join room for real-time updates |
| `leave-songs-room` | Leave the songs room            |

#### Server → Client

| Event          | Description    | Payload                                               |
| -------------- | -------------- | ----------------------------------------------------- |
| `song-created` | New song added | `{ type: 'created', song: {...}, timestamp }`         |
| `song-updated` | Song modified  | `{ type: 'updated', song: {...}, timestamp }`         |
| `song-deleted` | Song removed   | `{ type: 'deleted', songId, song: {...}, timestamp }` |


## 📁 Project Structure

```
music-manager/
├── backend/                      # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/          # CRUD & Statistics
│   │   ├── middlewares/          # Error handling
│   │   ├── model/                # Mongoose schema
│   │   ├── routes/               # API routes
│   │   ├── utils/                # Helper functions
│   │   ├── app.ts                # Express setup
│   │   └── server.ts             # Server + Socket.IO
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Navigation, Container
│   │   │   ├── songs/            # Song components
│   │   │   ├── stats/            # Statistics components
│   │   │   └── ui/               # Styled with Emotion
│   │   ├── features/
│   │   │   ├── songs/            # Redux Toolkit + Saga
│   │   │   └── stats/            # Redux Toolkit + Saga
│   │   ├── pages/
│   │   │   ├── SongsList.tsx
│   │   │   └── StatsDashboard.tsx
│   │   ├── services/             # Socket.IO client
│   │   ├── store/                # Redux store
│   │   └── types/                # TypeScript types
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## 🎨 Key Implementation Details

### TypeScript Usage (Minimal `any` type)

```typescript
// Proper typing throughout
export interface Song {
  _id: string;
  title: string;
  artist: string;
  songType: "single" | "album";
  genre: string;
  album?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Redux Toolkit State Management

```typescript
const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongsRequest: (state, action: PayloadAction<FetchSongsParams>) => {
      state.loading.fetch = true;
    },
    fetchSongsSuccess: (state, action: PayloadAction<FetchSongsResponse>) => {
      state.list = action.payload.data;
      state.loading.fetch = false;
    },
  },
});
```

### Redux-Saga for API Calls

```typescript
function* fetchSongsSaga(action: ReturnType<typeof fetchSongsRequest>) {
  try {
    const response: ApiResponse<Song[]> = yield call(
      songsApi.fetchSongs,
      action.payload
    );
    yield put(fetchSongsSuccess(response.data));
  } catch (error: any) {
    yield put(fetchSongsFailure(getErrorMessage(error)));
  }
}
```

### Emotion & Styled System

```typescript
import styled from "@emotion/styled";

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  background: ${({ variant }) =>
    variant === "primary" ? "#667eea" : "#6b7280"};
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;
```

### Real-Time Updates (Socket.IO)

```typescript
socket.on("song-created", (data: SocketEvent) => {
  dispatch(addSongToList(data.song));
});

socket.on("song-updated", (data: SocketEvent) => {
  dispatch(updateSongInList(data.song));
});
```

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

---

## 🙏 Acknowledgments

- **MERN Stack**: MongoDB, Express.js, React.js, Node.js
- **Redux Team**: Redux Toolkit and Redux-Saga
- **Socket.IO**: Real-time communication
- **Emotion**: CSS-in-JS styling solution

---

<div align="center">

### ⭐ hire me this repo if you find it useful!

**Built with the MERN Stack** 🚀

</div>
