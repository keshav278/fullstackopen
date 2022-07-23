import { useEffect, useState } from "react";
import axios from "axios";
import DisplayCountries from "./components/DisplayCountries";
//put key in .env before pushing
const App = () => {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState("");

  const changeCountryName = (event) => {
    setCountryName(event.target.value);
  };

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const filteredList =
    countryName === ""
      ? countries
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(countryName.toLowerCase())
        );

  return (
    <div>
      <p>
        {" "}
        find countries
        <input onChange={changeCountryName} />
      </p>
      <DisplayCountries list={filteredList} size={filteredList.length} />
    </div>
  );
};

export default App;
