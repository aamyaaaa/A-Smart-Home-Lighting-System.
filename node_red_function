// Simulating random sensor data for motion and ambient light
let motionDetected = Math.random() > 0.5 ? 1 : 0;  // Random motion detection (1 for detected, 0 for no motion)
let ambientLight = Math.floor(Math.random() * 1000);  // Random light level between 0-1000

// LED control logic based on the conditions:
let ledStatus = '';  // To store the LED status message
let ledBrightness = 0;  // LED brightness

if (ambientLight < 500) {  // Low ambient light
    if (motionDetected === 1) {
        ledBrightness = 255;  // Full brightness if motion detected
        ledStatus = "Low light outside + Motion detected: LED at full brightness";
    } else {
        ledBrightness = 100;  // Dim LED if no motion
        ledStatus = "Low light outside + No motion: LED dimmed";
    }
} else {  // High ambient light
    ledBrightness = 0;  // Turn off LED
    ledStatus = "Light outside: LED turned off";
}

// Output payload with simulated data
msg.payload = {
    motion_status: motionDetected,
    ambient_light_level: ambientLight,
    led_brightness: ledBrightness,
    led_status_message: ledStatus  // Message describing the LED status
};

return msg;
