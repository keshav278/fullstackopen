const mongoose = require('mongoose')
if(process.argv.length<3){
    console.log('Please provide the passowrd as an argumnet: node mongo.js <password> ')
    process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://keshav278:${password}@mycluster.69lnl9r.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person',personSchema)

mongoose
  .connect(url)
  .then((result)=>{
   if(process.argv.length==3) 
    {Person.find({}).then(result =>{
      result.forEach(person =>{
        console.log(person.name,person.number)
      })
      mongoose.connection.close()
    })}
    else{
      const person = new Person({
        name: process.argv[3],
        number:process.argv[4]
      })
      return person.save()
      .then(()=>{
        console.log('Added',process.argv[3],'number',process.argv[4])
        mongoose.connection.close()
      })
    }
    /*console.log('connected')

    const note = new Note({
        content: 'HTML is easy',
        date: new Date(),
        important: true,
    }) 
    return note.save()
  })
  .then(()=>{
    console.log('note saved!')
    return mongoose.connection.close()
  })*/
})
  .catch((err)=>console.log(err))