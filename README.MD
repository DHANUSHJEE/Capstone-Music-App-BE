


# Music Streaming App Backend

This project is the backend for a music streaming application. It allows users to manage songs, playlists, and comments. Users can upload, update, like, and comment on songs, as well as create and manage playlists.

## Features
- **Create and Manage Songs**: Add, update, and delete songs in the system.
- **Like Songs**: Users can like or unlike songs.
- **Add Comments**: Users can add comments to songs.
- **Create and Manage Playlists**: Users can create, view, add/remove songs to/from playlists, and delete playlists.
- **Download Songs**: (Optional feature, commented out for now).

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing songs, users, playlists, and comments.
- **Mongoose**: ODM for MongoDB to manage data models.
- **JWT**: JSON Web Tokens for authentication (not implemented in the provided code).
- **bcrypt**: Password hashing (not implemented in the provided code).

## API Endpoints

### Songs

- **GET /songs**: Get all songs.
- **POST /songs**: Create a new song.
- **GET /songs/:id**: Get a song by ID.
- **PUT /songs/:id**: Update a song by ID.
- **DELETE /songs/:id**: Delete a song by ID.
- **POST /songs/:id/like**: Like or unlike a song.
- **POST /songs/:id/comment**: Add a comment to a song.

### Playlists

- **POST /users/:userId/playlists**: Create a new playlist.
- **GET /users/:userId/playlists**: Get all playlists for a user.
- **POST /playlists/:playlistId/song**: Add a song to a playlist.
- **DELETE /playlists/:playlistId/song**: Remove a song from a playlist.
- **GET /playlists/:playlistId/songs**: Get all songs in a playlist.
- **DELETE /playlists/:id**: Delete a playlist.

## Setup and Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/music-streaming-app-backend.git
    ```

2. Install dependencies:

    ```bash
    cd music-streaming-app-backend
    npm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the root of the project.
    - Add the following environment variables:
    
      ```env
      MONGODB_URI=your_mongodb_connection_string
      PORT=5000
      JWT_SECRET=your_jwt_secret_key
      ```

4. Run the server:

    ```bash
    npm start
    ```

   The server will run on `http://localhost:5000`.

## Notes
- This is the backend code for the music streaming app. It is designed to be connected with a frontend that communicates through the provided API endpoints.
- The optional song download feature has been commented out in the `controller.js` file.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
