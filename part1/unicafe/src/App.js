import { useState } from 'react'

const Button = (props) =>{
   return (
    <button onClick={props.event}>{props.text}</button>
   )
}
const StatisticLine = ({text,value}) => {
  return (
    <tr>
     <td>{text}</td>
     <td>{value}</td>
    </tr>  
  )
}
const Statistics = ({good,neutral,bad}) => {
   if(good===0&&neutral===0&&bad===0){
     return (
       <div>
       <p>No feedback given yet</p>
       </div>
     )
     } 
    else{
      const all = good+bad+neutral
      const percent = '%'
      return(
        <table>
          <tbody>  
            <StatisticLine text = 'good' value = {good} />
            <StatisticLine text = 'neutral' value = {neutral} />
            <StatisticLine text = 'bad' value ={bad} />
            <StatisticLine text = 'all' value ={all} />
            <StatisticLine text = 'average' value ={(good-bad)/all}/>
            <StatisticLine text = 'positive' value ={good*100/all+percent} />
          </tbody>
        </table> 
       
      )
    } 

   }


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incGood = () => setGood(good+1)
  const incNeutral = () => setNeutral(neutral+1)
  const incBad = () => setBad(bad+1)
  
  return (
    <div>
     <h2>Give Feedback</h2>
     <Button event = {incGood} text = 'good'/>
     <Button event = {incNeutral} text = 'neutral'/>
     <Button event = {incBad} text = 'bad'/>
     <h2>Statistics</h2>     
     <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App;
