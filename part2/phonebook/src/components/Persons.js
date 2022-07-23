import React from "react";


const Persons = ({ list,del}) => {
  return (
    <>
      {list.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={(e)=>del(e,person.name,person.id)} key={person.id}>delete</button>
        </p>
      ))}
    </>
  );
};

export default Persons;
