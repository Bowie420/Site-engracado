const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

const clientId = process.env.SPOTIFY_CLIENT_ID || '11a73fdbec8b4e8e837eae1be557ec6e';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '8a49af646d2346e68287e2c9345c15a5';
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'https://genrefy-cyan.vercel.app/callback';

// Serve static files
app.use(express.static('public'));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the Spotify callback
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    console.log('Authorization code received:', code);

    if (!code) {
        console.error('Authorization code missing.');
        res.send('Authorization failed.');
        return;
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;
        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        // Redirect to game.html with the access token as a query parameter
        res.redirect(`/game.html?access_token=${access_token}`);
    } catch (error) {
        console.error('Error retrieving access token:', error.message);
        if (!res.headersSent) {
            res.status(500).send('Error retrieving access token.');
        }
    }
});

// Serve the game.html file
app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Serve other static files
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/background.mp4.mp4', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'background.mp4.mp4'));
});

app.get('/game_over.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game_over.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
