import React from "react";

const Filter = ({ onchange }) => {
  return (
    <>
      <p>
        filter shown with
        <input onChange={onchange} />
      </p>
    </>
  );
};

export default Filter;
