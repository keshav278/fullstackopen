import React from "react";

const PersonForm = ({
  onsubmit,
  changename,
  changenumber,
  namevalue,
  numvalue
}) => {
  return (
    <form onSubmit={onsubmit}>
      <div>
        name: <input onChange={changename} value={namevalue} />
      </div>
      <div>
        number: <input onChange={changenumber} value={numvalue} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
export default PersonForm;
