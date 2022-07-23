import React from "react";

const DisplayDetails = ({ country }) => {
  if (country === undefined) return <p>No result found </p>;
  const languageList = Object.values(country.languages);
  return (
    <>
      <h2>{country.name.common}</h2>
      <p> capital - {country.capital} </p>
      <p> area - {country.area} </p>
      <h3>languages: </h3>
      <ul>
        {languageList.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} width="200px" alt="no img found" />
    </>
  );
};

export default DisplayDetails;
