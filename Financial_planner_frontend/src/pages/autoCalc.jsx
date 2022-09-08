import { useNavigate } from "react-router-dom"
import "../components/autoCalc.css"
import { useState } from 'react';





const AutoCalculator = () => {

    let navigate = useNavigate()

    const [autoRow, setAutoRow] = useState({})
    const [monthlyPayment, setMonthlyPayment] = useState(0)

    const onChangeAuto = (e) => {
        let name = e.target.name
        let val = e.target.value
    
        setAutoRow(prev => ({...prev, [name]:val}))
        
    }

    const monthPaymentCalc = () => {

        let principle = 0
        let term = 0
        let interestRate = 0
        let insurance = 0
        let tradeIn = 0
        let downPayment = 0
        let annualInterest = 0
        let interest = 0
        let wmonthlyPayment = 0

        principle = parseFloat(autoRow["principle"])
        term = parseFloat(autoRow["term"])
        interestRate = parseFloat(autoRow["interest-rate"])
        insurance = parseFloat(autoRow["insurance"])
        tradeIn = parseFloat(autoRow["trade-in"])
        downPayment = parseFloat(autoRow["down-payment"])

        

        interest = (parseFloat(interestRate) / 12) / 100
        
        console.log(interest)

        let newPrinciple = principle - tradeIn - downPayment

        let i1 = Math.pow(1+interest, term)


        wmonthlyPayment = newPrinciple * (interest * i1)/(i1 - 1)

        let newMonthlyPayment = wmonthlyPayment + insurance

        setMonthlyPayment(newMonthlyPayment.toFixed(2))

        console.log(newMonthlyPayment)
        
    }

    return (
        <div className="auto-calulator">
            <h1 className="header">Auto Calculator</h1>
            <h3 className="note">Optional fields use national average if no value is provided.</h3>
            <div className="container">
                <div className="form">
                    <input name="principle" type="number" placeholder="Enter Car Price" className="price" onChange={onChangeAuto}/>
                    <select className="dropdown" name="term" id="term" onChange={onChangeAuto}>
                        <option value="" >Term</option>
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                        <option value="48">48 Months</option>
                        <option value="60">60 Months</option>
                        <option value="72">72 Months</option>
                    </select>
                    <input name="interest-rate" type="number" step={'0.01'} placeholder="APR %" onChange={onChangeAuto}/>
                    <input name="insurance" type="number" step={'0.01'} placeholder="Insurance Cost (Optional)" onChange={onChangeAuto}/>
                    <input name="trade-in" type="number" step={'0.01'} placeholder="Trade In Value" onChange={onChangeAuto}/>
                    <input name="down-payment" type="number" step={'0.01'} placeholder="Down Payment" onChange={onChangeAuto}/>
                </div>
                <div className="btn-container">
                    <button className="btn" type="submit" onClick={monthPaymentCalc}>Calculate</button>
                </div>
                <div className="monthlyPayment">
                    ${monthlyPayment} Monthly Payment
                </div>
            </div>
        </div>
    )
}



export default AutoCalculator