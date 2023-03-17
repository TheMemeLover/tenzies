import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    let timeout
    const [time, setTime] = React.useState({
        seconds : 0,
        minutes: 0
    })
    const [turns, setTurns] = React.useState(0)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [recordsObject, setRecordsObject] = React.useState({
        recordTurns: localStorage.getItem("recordTurns")==null ? [10000] : [localStorage.getItem("recordTurns")], 
        recordTime: localStorage.getItem("recordTime")==null ? [10000] : [localStorage.getItem("recordTime")]
        })
    
            
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            
        }
    }, [dice])
    
    React.useEffect(() => {
        if (tenzies == false){
            timeout = setTimeout(() => {
            setTime(prevTime => (
                {...prevTime,
                    seconds: prevTime.seconds === 59 ? 0 : prevTime.seconds + 1,
                    minutes: prevTime.seconds === 59 ? prevTime.minutes + 1 : prevTime.minutes
                }
                ))}, 1000)
        }else if (tenzies){
            setRecordsObject(prevObject => ({
                ...prevObject,
                recordTurns: [...recordsObject["recordTurns"], turns],
                recordTime: [...recordsObject["recordTime"], convertTime()]
                }))
            let turnResult = recordsObject.recordTurns.every(item => turns < item)
            let timeResult = recordsObject.recordTime.every(item => convertTime() < item)
            turnResult && localStorage.setItem("recordTurns", turns)
            timeResult && localStorage.setItem("recordTime", convertTime())
            
        }
        
        return () => clearTimeout(timeout)
            }, [time])
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function convertTime() {
        return time.minutes * 60 + time.seconds
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setTurns(prevTurns => prevTurns + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setTurns(0)
            setTime({ seconds : 0, minutes: 0 })
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <>
            <h3 className="record">Made by Daniel Wang</h3>
            <main>
                {tenzies && <Confetti />}
                <div className="title--section">
                <h3 className="turns">Turns: {turns}</h3>
                <h1 className="title">Tenzies</h1>
                <h3 className="time">{`${time.minutes < 10 ? "0" + time.minutes : time.minutes} : ${time.seconds < 10 ? "0" + time.seconds : time.seconds}`}</h3>
                </div>
                <p className="instructions">Roll until all dice are the same. 
                Click a die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                
                
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                
            </main>
            <h3 className="record">Best Turns: {localStorage.getItem("recordTurns")}</h3>
            <h3 className="record">Best Time: {Math.floor(localStorage.getItem("recordTime")/60) < 10 ? "0" + Math.floor(localStorage.getItem("recordTime")/60) : Math.floor(localStorage.getItem("recordTime")/60) } : {(localStorage.getItem("recordTime") % 60) < 10 ? "0" + (localStorage.getItem("recordTime") % 60) : (localStorage.getItem("recordTime") % 60)}</h3>
        </>
    )
}
