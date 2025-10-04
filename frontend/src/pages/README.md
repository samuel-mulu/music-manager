# Pages Directory

This directory contains the main page components of the application. Each page represents a complete view/screen that users can navigate to.

## Structure

```
pages/
├── SongsList.tsx       # Music library page with song management
├── StatsDashboard.tsx  # Statistics and analytics dashboard
├── index.ts           # Central export file for clean imports
└── README.md          # This documentation
```

## Pages

### SongsList.tsx

- **Purpose**: Main music library interface
- **Features**:
  - Song listing with pagination
  - Search and filtering functionality
  - CRUD operations (Create, Read, Update, Delete)
  - Real-time updates via Socket.IO
  - Professional card-based layout
  - Delete confirmation modal

### StatsDashboard.tsx

- **Purpose**: Analytics and statistics overview
- **Features**:
  - Compact stats cards (Total Songs, Artists, Genres, etc.)
  - Genre breakdown with scrollable content
  - Artist breakdown with scrollable content
  - Song type breakdown with scrollable content
  - Recent songs list
  - Key insights section
  - Metadata information

## Import Usage

```typescript
// Clean imports from central location
import { SongsList, StatsDashboard } from "../pages";

// Or individual imports
import { SongsList } from "../pages/SongsList";
import { StatsDashboard } from "../pages/StatsDashboard";
```

## Benefits of This Structure

1. **Separation of Concerns**: Pages are separate from feature logic
2. **Clean Organization**: Easy to find and maintain page components
3. **Scalability**: Easy to add new pages as the app grows
4. **Clean Imports**: Central export file prevents deep import paths
5. **Consistent Naming**: All pages follow the same naming convention
6. **Documentation**: Each page is self-contained and documented

## Migration Notes

- Moved from `features/songs/songslist.tsx` → `pages/SongsList.tsx`
- Moved from `features/stats/StatsDashboard.tsx` → `pages/StatsDashboard.tsx`
- Updated imports in `App.tsx` to use the new structure
- All functionality remains exactly the same, just better organized
