import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';

const App = () => {
  const [citiesInput, setCitiesInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidInput = (input) => {
    return input.trim() !== '';
  };

  const getWeatherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/weather?cities=${citiesInput}`);
      
      const successfulResponses = response.data.filter(data => !data.error);

      if (successfulResponses.length > 0) {
        setWeatherData(successfulResponses);
        setErrorMessage('');
      } else {
        setErrorMessage('No valid cities found');
        setWeatherData(null);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setErrorMessage('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCitiesInput(e.target.value);
    setErrorMessage('');
  };

  const handleGetWeather = () => {
    if (isValidInput(citiesInput)) {
      getWeatherData();
    } else {
      setErrorMessage('Please enter at least one valid city');
      setWeatherData(null);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Weather App
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Enter city names (comma-separated)"
          value={citiesInput}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetWeather}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Weather'}
        </Button>

        {errorMessage && <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>{errorMessage}</Typography>}

        {weatherData && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Weather Information
            </Typography>
            <ul>
              {weatherData.map((cityData) => (
                <li key={cityData.city}>
                  <strong>{cityData.city}:</strong> {cityData.weather}, Temperature: {cityData.temperature}, Humidity: {cityData.humidity}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default App;