import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const Notification = ({message,type}) => {
  if(message === null) {
    return null
  }
  if(type===1){
    return (
      <div className='addorupdate'>{message}</div>
    )
  }
  if(type===2){
    return(
      <div className="error">{message}</div>
    )
  }
 
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setfilterName] = useState("");
  const [message, setMessage] = useState(null) 
  const [messageType,setMessageType]=useState(0);

  useEffect(() => {
      personService
      .getPersons()
      .then(initialPersons => setPersons(initialPersons))
  }, []);

  const changeName = (event) => {
    setNewName(event.target.value);
  };
  const changeNumber = (event) => {
    setNewNumber(event.target.value);
  };
  const changeFilter = (event) => {
    setfilterName(event.target.value);
  };
  const filterList =
    filterName === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filterName.toLowerCase())
        );

  const addPerson = (event) => {
    event.preventDefault();
    const toAddPerson = {
      name: newName,
      number: newNumber,
      
    };
    if (persons.find((person) => person.name === newName) === undefined)
      {
       personService
       .createPerson(toAddPerson)
       .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setMessageType(1)
        setMessage(`Added ${newPerson.name}`)
        setTimeout(() =>{
          setMessage(null)
        },5000)
      })
        
    }
    else if(persons.find((person)=>person.name === newName && person.number!==newNumber)!== undefined)
    {
      if(window.confirm(`${toAddPerson.name} is already added in the phonebook, do you want to update the phone number?`))
      {
        const toUpdate = persons.find((person)=>person.name === newName)
        personService
        .updatePerson(toUpdate.id,toAddPerson)
        .then(updatedPerson => {setPersons(persons.map(person =>{
          
          return person.id!==toUpdate.id?person:updatedPerson;
          
        }))
      
        setMessageType(1)
        setMessage(`Updated ${updatedPerson.name}`)
        setTimeout(() =>{
          setMessage(null)
        },5000)
     })
      .catch(error => {
        console.log('error')
        setMessageType(2)
        setMessage(`Information on ${toAddPerson.name} has already been removed from the server`)
        setTimeout(() =>{
          setMessage(null)
        },5000)
      })
      }
    }
    else alert('Name and phone number already exist!')
    setNewName("");
    setNewNumber("");
  };

  const delPerson = (e,name,id)=>{
    e.preventDefault();
     if(window.confirm(`Delete ${name}? `))
     {personService
     .deletePerson(id)
     .then(res => {setPersons(persons.filter(person=>person.id!==id))
      setMessageType(1)
      setMessage(`Successfully deleted ${name}`)
      setTimeout(() =>{
        setMessage(null)
      },5000)
    } )}
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType}/>
      <Filter onchange={changeFilter} />
      <h3>Add a new contact</h3>
      <PersonForm
        onsubmit={addPerson}
        changename={changeName}
        namevalue={newName}
        changenumber={changeNumber}
        numvalue={newNumber}
      />
      <h2>Numbers</h2>
      <Persons list={filterList} del= {delPerson}  />
    </div>
  );
};

export default App;
