const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(express.json());

// Route for the main landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the 3D game
app.get('/3d', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '3d', 'index.html'));
});

// Function to log to Slack
async function logToSlack(ip) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    console.log('Webhook URL present:', !!webhookUrl);
    if (!webhookUrl) {
        console.warn('SLACK_WEBHOOK_URL not set');
        return;
    }

    console.log('Attempting to log to Slack for IP:', ip);
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: `Successful password entry from IP: ${ip} at ${new Date().toISOString()}`
            }),
        });
        if (response.ok) {
            console.log(`Logged to Slack successfully: ${ip}, status: ${response.status}`);
        } else {
            console.error(`Slack webhook failed: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Failed to log to Slack:', error.message);
    }
}

// Route to log successful password entry
app.post('/log-access', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log(`Successful password entry from IP: ${ip}`);
    logToSlack(ip);
    res.status(200).send('Logged');
});

// Start the server
app.listen(PORT, () => {
    console.log(`NY1609 game server running on http://localhost:${PORT}`);
    console.log('Navigate to the URL above to play the game!');
});