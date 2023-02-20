import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    const [numbers, setNumbers] = React.useState(numbersList(props.value))
    let pips = numbers.map(number => <div className="die-pip" key={number}></div>)
    
    function numbersList(num) {
        let numArray = []
        for (let i = 0; i < num; i++) {
            numArray.push(i)
        }
        return numArray
    }
    
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {pips}
        </div>
    )
}
