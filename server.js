const express = require('express');
const helmet = require('helmet'); // Helmet for security
const fs = require('fs'); // To read SSL certificates
const https = require('https'); // HTTPS module
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// SSL Certificates for HTTPS
onst privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Use Helmet to secure HTTP headers
app.use(helmet());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// MongoDB connection URI
const uri = 'mongodb+srv://guptaaamya1204:Jo3dymy1XhaOhDDk@cluster0.qkvpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function connectToDB() {
  await client.connect();
  const db = client.db('iot_data');
  const collection = db.collection('sensor_data');
  return collection;
}

// Lighting control logic
app.get('/lighting-status', async (req, res) => {
  const collection = await connectToDB();

  // Simulate motion and ambient light
  const motionDetected = Math.random() > 0.5 ? 1 : 0;
  const ambientLight = Math.floor(Math.random() * 1000);

  // LED control logic
  let ledBrightness;
  let ledStatus;
  if (ambientLight < 500) {
    if (motionDetected) {
      ledBrightness = 255;
      ledStatus = 'Low light + Motion detected: LED at full brightness';
    } else {
      ledBrightness = 100;
      ledStatus = 'Low light + No motion: LED dimmed';
    }
  } else {
    ledBrightness = 0;
    ledStatus = 'Light outside: LED off';
  }

  // Insert data into MongoDB
  await collection.insertOne({
    timestamp: new Date(),
    motion_detected: motionDetected,
    ambient_light: ambientLight,
    led_brightness: ledBrightness,
    led_status: ledStatus
  });

  // Send response to front-end
  res.json({
    motion_detected: motionDetected,
    ambient_light: ambientLight,
    led_brightness: ledBrightness,
    led_status: ledStatus
  });
});

// Serve your HTML file (from 'public' folder)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Smart Lighting app listening at https://localhost:${port}`);
});
