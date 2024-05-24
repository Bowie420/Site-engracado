// server.js
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

const clientId = '11a73fdbec8b4e8e837eae1be557ec6e';
const clientSecret = '8a49af646d2346e68287e2c9345c15a5';
const redirectUri = 'https://genrefy-cyan.vercel.app/callback';

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
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
        console.log(oiiiii);
        res.redirect(`/game.html?access_token=${access_token}`);

        // Store tokens or handle them as needed
       // res.send(`Access Token: ${access_token}<br>Refresh Token: ${refresh_token}`);
    } catch (error) {
        if(!res.headersSent) {
            res.status(500).send('Error retrieving access token.');
        }
    }
});
app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));

});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

});
app.get('/background.mp4.mp4', (req, res) => {
    res.sendFile(path.join(__dirname, 'background.mp4.mp4'));

});
app.get('/game_over.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'game_over.html'));
});


app.listen(port, () => {
    console.log(`Server running at https://genrefy-cyan.vercel.app/${port}/`);
});