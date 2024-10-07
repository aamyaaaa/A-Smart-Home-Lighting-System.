import random
import datetime
import pymongo

# MongoDB connection string
client = pymongo.MongoClient("mongodb+srv://guptaaamya1204:Jo3dymy1XhaOhDDk@cluster0.qkvpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['iot_data']
collection = db['sensor_data']

def generate_sensor_data(sensor_id):
    current_time = datetime.datetime.now().isoformat()
    motion_status = random.choice([0, 1])
    ambient_light_level = random.randint(0, 1000)
    led_brightness = 255 if motion_status == 1 and ambient_light_level < 500 else 100 if ambient_light_level < 500 else 0

    data = {
        "sensor_id": sensor_id,
        "timestamp": current_time,
        "motion_status": motion_status,
        "ambient_light_level": ambient_light_level,
        "led_brightness": led_brightness
    }

    # Insert data into MongoDB
    collection.insert_one(data)
    print(f"Inserted data: {data}")

# Generate random data
if __name__ == "__main__":
    for i in range(10):  # Generate 10 sensor data entries
        generate_sensor_data("PIR001")
