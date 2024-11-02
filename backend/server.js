const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks'); 
const peopleRoutes = require('./routes/people');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser'); // Import body-parser

// Initialize Express and connect to MongoDB
const app = express();
connectDB();

// Log file path
const logFilePath = path.join(__dirname, 'logs.txt');

// Logging function
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
};

// Middleware
const allowedOrigins = [
  // 'http://localhost:5173', // for local development frontend
  'https://atharv1599-gmail-com-cuvette-final-evaluation-may.vercel.app' // Vercel production frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// app.use(cors());
// app.use(cors({ origin: 'http://localhost:5173' }));

app.use(bodyParser.json()); // Use body-parser to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Example log on server start
logToFile('Server started.');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/people', peopleRoutes);

// Define root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Example log on each incoming request
app.use((req, res, next) => {
  logToFile(`Received ${req.method} request for ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logToFile(`Server running on port ${PORT}`);
});
