const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the 3D game
app.get('/3d', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '3d', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`NY1609 game server running on http://localhost:${PORT}`);
    console.log('Navigate to the URL above to play the game!');
});