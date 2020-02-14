const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);


// Handle production
//if (process.env.NODE_ENV === 'production') {
if (process.env.NODE_ENV === 'development') {
    // Static folder
    app.use(express.static(__dirname + '/public/'));

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;
//const hostname = '192.168.2.67';
const hostname = '192.168.2.70';

app.listen(port, hostname, () => console.log(`Server started at http://${hostname}:${port}/`));
