// MongoDB initialization script
db = db.getSiblingDB("addis_songs");

// Create application user
db.createUser({
  user: "songuser",
  pwd: "songpass123",
  roles: [
    {
      role: "readWrite",
      db: "addis_songs",
    },
  ],
});

// Create collections with validation
db.createCollection("songs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "artist", "songType", "genre"],
      properties: {
        title: {
          bsonType: "string",
          description: "Song title is required and must be a string",
        },
        artist: {
          bsonType: "string",
          description: "Artist name is required and must be a string",
        },
        songType: {
          enum: ["single", "album"],
          description: "Song type must be either single or album",
        },
        genre: {
          bsonType: "string",
          description: "Genre is required and must be a string",
        },
        createdAt: {
          bsonType: "date",
          description: "Created date must be a date",
        },
        updatedAt: {
          bsonType: "date",
          description: "Updated date must be a date",
        },
      },
    },
  },
});

// Create indexes for better performance
db.songs.createIndex({ title: 1 });
db.songs.createIndex({ artist: 1 });
db.songs.createIndex({ songType: 1 });
db.songs.createIndex({ genre: 1 });
db.songs.createIndex({ createdAt: -1 });

// Insert sample data
db.songs.insertMany([
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    songType: "single",
    genre: "Rock",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Imagine",
    artist: "John Lennon",
    songType: "album",
    genre: "Rock",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Billie Jean",
    artist: "Michael Jackson",
    songType: "single",
    genre: "Pop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

print("Database initialized successfully!");
