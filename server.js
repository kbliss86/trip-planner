require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Log the API key to ensure it is being loaded
console.log("MapQuest API Key:", process.env.MAPQUEST_KEY);

// Serve static files from the assets directory at the /assets path
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve the index.html file when the root route is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to send the API key to the client
app.get('/api/getApiKey', (req, res) => {
    res.json({ apiKey: process.env.MAPQUEST_KEY});
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
