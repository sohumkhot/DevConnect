const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))