import axios from 'axios';
const baseURL = "http://localhost:3001/persons"

const getPersons = ()=>{
     const request = axios.get(baseURL)
     return request.then(response => response.data)
}

const createPerson = (newPerson) =>{
    const request = axios.post(baseURL,newPerson)
    return request.then(response => response.data)
}
const deletePerson = (id) =>{
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(console.log('deleted'))
}
const updatePerson = (id,newObject) =>{
    const request = axios.put(`${baseURL}/${id}`,newObject)
    return request.then(response=>response.data)
}
export default {
    getPersons,
    createPerson,
    deletePerson,
    updatePerson,
}