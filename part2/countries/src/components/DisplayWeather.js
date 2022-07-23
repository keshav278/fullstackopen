import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const DisplayWeather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid={your_api_key}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [country.capital]);
  if (!weather) {
    return <p>Processing</p>;
  } else {
    return (
      <>
        <h3>Weather in {country.capital[0]}</h3>
        <p>temperature {weather.main.temp} celsius</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="loading"
        />
        <p>wind {weather.wind.speed} m/s</p>
      </>
    );
  }
};
export default DisplayWeather;
