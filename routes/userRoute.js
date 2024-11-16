import express from "express";
import controller from "../controller/controller.js";
import verifyToken from "../Auth/auth.js";  // Import verifyToken middleware

const router = express.Router();

// User authentication routes
router.post("/signup", controller.register);
router.post("/login", controller.login);
router.post("/forgotpassword", controller.forgotPassword);

// Artist Routes
router.post('/saveArtist', verifyToken, controller.saveArtist); // Protect route
router.get('/getOneArtist/:id', controller.getOneArtist);
router.get('/getAllArtist', controller.getAllArtist);
router.delete('/deleteArtist/:id', verifyToken, controller.deleteArtist); // Protect route
router.put('/updateArtist/:id', verifyToken, controller.editArtist); // Protect route

// Album Routes
router.post('/saveAlbum', verifyToken, controller.saveAlbum); // Protect route
router.get('/getOneAlbum/:id', controller.getOneAlbum);
router.get('/getAllAlbum', controller.getAllAlbum);
router.delete('/deleteAlbum/:id', verifyToken, controller.deleteAlbum); // Protect route
router.put('/updateAlbum/:id', verifyToken, controller.editAlbum); // Protect route
router.post('/saveSongToAlbum/:id', verifyToken, controller.addSongToAlbum); // Protect route

// Song Routes
router.post('/saveSong', verifyToken, controller.saveSong); // Protect route
router.get('/getOneSong/:id', controller.getSongById);
router.get('/getAllSongs', controller.getAllSongs);
router.delete('/deleteSong/:id', verifyToken, controller.deleteSongById); // Protect route
router.put('/updateSong/:id', verifyToken, controller.updateSongById); // Protect route
// router.get('/downloadSong/:id', controller.downloadSong);
router.post('/likeSong/:id', controller.addLike);
router.post('/commentSong/:id', controller.addComment);

// Playlist Routes (Protected with Token)
router.post("/createPlaylist/:userId", verifyToken, controller.createPlaylist); // Protect route
router.get("/getUserPlaylists/:userId", verifyToken, controller.getUserPlaylists); // Protect route
router.put("/addSongToPlaylist/:playlistId", verifyToken, controller.addSongToPlaylist); // Protect route
router.put("/removeSongFromPlaylist/:playlistId", verifyToken, controller.removeSongFromPlaylist); // Protect route
router.get("/getSongInPlaylist/:playlistId", verifyToken, controller.getSongsInPlaylist); // Protect route
router.delete("/deletePlaylist/:id", verifyToken, controller.deletePlaylist); // Protect route
router.put("/playlists/:playlistId", verifyToken, controller.updatePlaylistName); // Update a playlist's name
export default router;
