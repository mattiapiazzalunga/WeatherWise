import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import Button from 'react-bootstrap/Button';

function WeatherSearch() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorWeather, setErrorWeather] = useState(null);
  const [errorPlaces, setErrorPlaces] = useState(null);
  const [posts, setPosts] = useState([]);
  const [response1, setResponse1] = useState(null);
  const [response2, setResponse2] = useState(null);
  const [response3, setResponse3] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Fetch weather and point of interest data
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response1 = await axios.get(`http://localhost:8080/meteo/${location}`);
      setWeatherData(response1.data);
      setErrorWeather(null);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setErrorWeather('Error fetching weather. Please try again later.');
      setWeatherData(null);
    }

    try {
      const response2 = await axios.get(`http://localhost:8080/places/citta/${location}`);
      setPosts(response2.data);
      setErrorPlaces(null);
    } catch (error) {
      console.error('Error fetching point of interest:', error);
      setErrorPlaces('Error fetching location data. Please try again later.');
      setPosts([]);
    }
  };
  
  const handleFeedbackSubmit = async (value) => {
    try {
      const response3 = await axios.post('YOUR_POST_URL_HERE', {
        id: location,
        rating: value
      });
      setFeedback(response3.data);
      //setErrorFeedback(null);
      console.log('Feedback submitted:', response3.data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setFeedback(null);
      //setErrorFeedback('Error submitting feedback. Please try again.');
    }
  };

  return (
    <div>
      <div>
        <form className="form-container" onSubmit={handleSubmit}>
          <label className="form-label">
            <input
              className="form-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <button className="form-submit" type="submit">Search</button>
        </form>
        {errorWeather && <p>{errorWeather}</p>}
        {weatherData && (
          <div className="weather-container">
            
            <div className="weather-content">
              <h1>meteo</h1>
              <h2>{weatherData.data.name}</h2>
              <p>Temperature: {weatherData.data.main.temp}</p>
              <p>Humidity: {weatherData.data.main.humidity}</p>
            </div>
            {weatherData.data.weather.map((item, index) => (
              <div key={index}>
                <img className="weather-icon" src={"http://openweathermap.org/img/w/" + item.icon + ".png"} alt="Weather Icon" /> 
                <p>Weather: {item.main}</p>
                <p>Description: {item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <form>
          <div className="button-container">
            <button className="feedback-button" type="button" onClick={(e) => handleFeedbackSubmit(1)}>
              <span className="icon"><AiFillLike /></span> 
            </button>
            <button className="feedback-button" type="button" onClick={(e) => handleFeedbackSubmit(0)}>
              <span className="icon"><AiFillDislike /></span>
            </button>
          </div>
        </form>
        {feedback && (
          <div>
            <h3>Saved Successfully</h3>
            <p>{feedback.message}</p>
          </div>
        )}
      </div>
      <div>
        <h2>Point of Interest</h2>
        <div className="card-container">
          {posts.length === 0 ? (
            <p>No point of Interest Available</p>
          ) : (
            posts.map((post) => (
              <div className="card" key={post.id}>
                <div className="card-header">
                  #{post.id} {post.placeName}
                  <p className="card-text">{post.userName}</p>
                </div>
                <div className="card-body">
                  <p className="card-text">{post.rating}</p>
                  <p className="card-text">{post.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherSearch;
