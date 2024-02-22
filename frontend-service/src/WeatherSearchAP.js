import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import StarRatingInput from './StarRatingInput';
import { flushSync } from 'react-dom';


function WeatherSearchAP() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [posts, setPosts] = useState([]);
  const [weatherProbability, setWeatherProbability] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [newPointOfInterest, setNewPointOfInterest] = useState({
    userName: '',
    placeName: '',
    city: '',
    description: '',
    rating: 0
  });

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [suggestions, setSuggestions] = useState([]);

  const url = process.env.API_GATEWAY

  
  // Fetch weather and point of interest data
  const  handleSubmit = async (event = null) => {
    try {
      const response1 = await axios.get(`${url}/meteo/${location}`);
      setWeatherData(response1.data);
     
    } catch (error) {
      console.error('Error fetching weather:', error);
    
      setWeatherData(null);
    }

    try {
      const response2 = await axios.get(`${url}/places/cities/${location}`);
      setPosts(response2.data);
    } catch (error) {
      console.error('Error fetching point of interest:', error);
      setPosts([]);
    }

    try {
      const response4 = await axios.get(`${url}/feedbacks/percentage/${location}`);
      setWeatherProbability(response4.data);
    } catch (error) {
      console.error('Error fetching weather probability:', error);
      setWeatherProbability(null);
    }

   
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
   
    return () => clearInterval(intervalId);
  }, []); 


    const fetchSuggestions = async () => {
      try {
        // ${window.__RUNTIME_CONFIG__.GATWAY_SERVICE_API}
        const response = await axios.get(`${url}/cities/${location}`);
        //const response = ['Bergamo', 'Bormio','Milano','Paris', 'London', 'Tokyo'];

        console.log(location);
        console.log(response.data.data.geonames);
        setSuggestions(response.data.data.geonames);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

      // Handle input change event
  const handleInputChange = (event) => {
    const { value } = event.target;
    setLocation(value); 
    fetchSuggestions(value); 
  };

  const handleSuggestionClick = (value) => {
    setLocation(value); 
     handleSubmit();
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  // This function will be invoked only once when the component mounts
  console.log('Component mounted');
  flushSync(() => {
    setLocation("Bergamo");
  });
  console.log(location);
  handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); 
  

  
  

  const handleFeedbackSubmit = async (value) => {
    try {
      console.log({id: location, rating: value});
      const response3 = await axios.post(`${url}/feedbacks/`, {
        city: location,
        isLike: Number(value)
      });
      setFeedback(response3.data);
      setErrorFeedback(null);
      handleSubmit();
      console.log('Feedback submitted:', response3.data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setFeedback(null);
      setErrorFeedback('Error submitting feedback. Please try again.');
    }
  };

 


  const handlePointOfInterestSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      userName:newPointOfInterest.userName,
      placeName:newPointOfInterest.placeName,
      city:location,
      description:newPointOfInterest.description,
      rating:Number(newPointOfInterest.rating)
    };
    try {
      console.log(userData);
      const response4 = await axios.post(`${url}/places/`, userData);
      console.log('Point of interest added:', response4.data);
      setNewPointOfInterest({
        userName: '',
        placeName: '',
        description: '',
        rating: 0
      });
      setLocation(location);
      // Reload the page
      handleSubmit();
    } catch (error) {
      console.error('Error adding point of interest:', error);
      // Handle error
    }
  };


  const handleChangePointOfInterest = (e) => {
    const value = e.target.value;
    setNewPointOfInterest({
      ...newPointOfInterest,
      [e.target.name]: value
    });
  };

  const handleRatingChange = (value) => {
    setNewPointOfInterest({
      ...newPointOfInterest,
      rating: value
    });
  };


  return (
    <div>
      <div className="header">
      <h2>Search by City</h2>
      <div>
        <div className="form-container" >
          <label className="form-label">
            <input
              className="form-input"
              type="text"
              list="suggestions"
              value={location}
              onChange={handleInputChange}
              defaultValue="Bergamo" 
            />
            </label>
  {  suggestions && suggestions.length > 0 && (
   <datalist id="suggestions">v
    { suggestions.map((suggestion, index) => (
      <option key={index} value={suggestion.name} onClick={() => handleSuggestionClick(suggestion.name)} />
    ))}
  </datalist>
)}

         
          <button className="form-submit" onClick={handleSubmit}>SEARCH</button>  
        </div>

        {weatherData ? (
  <div className="weather-container">
    <div className="weather-content">
      {currentDateTime.toLocaleString()}
      <h2>{weatherData.data.name}</h2>
      <h3>{Math.round(weatherData.data.main.temp)}°C</h3>
      <p>Humidity: {weatherData.data.main.humidity}%</p>
    </div>
    <div className='weather-icon'>
      {weatherData.data.weather.map((item, index) => (
        <div key={index}>
          <img className="weather-icon" src={"http://openweathermap.org/img/w/" + item.icon + ".png"} alt="Weather Icon" /> 
          <h3> {item.main}</h3>
          <p><b>{item.description}</b></p>
        </div>
      ))}
    </div>
  </div>
) : (
  <div>No weather data available</div>
)}
      </div>
      <div className='feedback-container'>
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
        <div className='probabilty-container'>
        {errorFeedback && <p>{errorFeedback}</p>}
        {feedback && (
          <div>
            <h2>Saved Successfully</h2>
            <p>{feedback.message}</p>
          </div>
        )}

        {weatherProbability === 'NaN' || weatherProbability === null  ? ( 
            <p>No Weather Probability </p> ) : (
              <div>
              <h2>Service Trust: {Math.round(weatherProbability)}%</h2>
              </div>
            )}
        </div>
        </div>

      </div>
      <div>
       
        <div className="card-container">
          {posts.length === 0 ? (
            <p>No point of Interest Available</p>
          ) : (
            posts.map((post) => (
              <div className="card" key={post.id}>
                <div className="card-header">
                   <h3>{post.placeName}</h3>
                  <p className="card-text">{post.userName}</p>
                </div>
                <div className="card-body">
                <StarRatingInput value={post.rating} readOnly/>
                  <p className="card-text">{post.description}</p>
                </div>
              </div>
            ))
          )}


{location && 
<div>
<div className="card" >
  <div className='card-header'>
     <h3>Add New Point of Interest</h3>
     </div>
     
      <form onSubmit={handlePointOfInterestSubmit}>
        <label className="form-label">
          Place Name
          <input
           className="form-input"
            type="text"
            name="placeName"
            value={newPointOfInterest.placeName}
            onChange={handleChangePointOfInterest}
          />
        </label>
        <label className="form-label">
          User Name
          <input
           className="form-input"
            type="text"
            name="userName"
            value={newPointOfInterest.userName}
            onChange={handleChangePointOfInterest}
          />
        </label>
        <label className="form-label">
        Rating
              <StarRatingInput value={newPointOfInterest.rating} onChange={handleRatingChange} />
        </label>
        <label className="form-label">
          Description:
          <textarea
           className="form-input"
            name="description"
            value={newPointOfInterest.description}
            onChange={handleChangePointOfInterest}
          />
        </label>
        <button  className="form-submit"type="submit">ADD</button>
      </form>
    </div>
</div>
}
        </div>
      </div>

    </div>
  );
}


export default WeatherSearchAP;
