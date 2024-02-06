import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

if (!WEATHER_API_KEY) {
  console.error('Weather API key is missing. Please provide a valid key.');
  process.exit(1); 
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/weather', async (req, res) => {
  const cities = req.query.cities;

  if (!cities) {
    return res.status(400).json({ error: 'Cities parameter is missing' });
  }

  try {
    const cityArray = cities.split(',').map(city => city.trim());

    const weatherPromises = cityArray.map(async city => {
      try {
        const weatherResponse = await axios.get(
          `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${city}`
        );
        return {
          city,
          weather: weatherResponse.data.current.condition.text,
          temperature: weatherResponse.data.current.temp_c,
          humidity: weatherResponse.data.current.humidity,
        };
      } catch (error) {
        console.error(`Error fetching weather data for ${city}: ${error.message}`);
        return {
          city,
          error: 'Failed to fetch weather data',
        };
      }
    });

    const weatherData = await Promise.all(weatherPromises);

    res.json(weatherData);
  } catch (error) {
    console.error('Error processing weather data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
