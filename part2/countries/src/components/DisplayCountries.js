import React from "react";
import { useState } from "react";
import DisplayDetails from "./DisplayDetails";
import DisplayWeather from "./DisplayWeather";
const DisplayCountries = ({ list, size }) => {
  const [showDetails, setShowDetails] = useState(Array(10).fill(false)); //max size 10
  if (list.length > 0) {
    if (size > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (size <= 10 && size > 1) {
      return (
        <>
          {list.map((country, index) => (
            <div key={index}>
              {country.name.common}
              <button
                key={index}
                onClick={() =>
                  setShowDetails(
                    showDetails.map((show, ind) => {
                      return ind === index ? !show : show;
                    })
                  )
                }
              >
                {showDetails[index] ? "hide" : "show"}
              </button>

              {showDetails[index] ? <DisplayDetails country={country} /> : ""}
            </div>
          ))}
        </>
      );
    } else {
      return (
        <>
          <DisplayDetails country={list[0]} />
          <DisplayWeather country={list[0]} />
        </>
      );
    }
  }
};
export default DisplayCountries;
