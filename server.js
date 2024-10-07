const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Smart Lighting app listening at http://localhost:${port}`);
});
