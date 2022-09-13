import { useNavigate } from "react-router-dom"
import "../components/mortgageCalc.css"
import { useState } from 'react';

const MortgageCalculator = () => {

    let navigate = useNavigate()

    const [mortgageRow, setMortgageRow] = useState({})

    const [mortgagePayment, setMortgagePayment] = useState(0)

    const onChangeMortgage = (e) => {
        let name = e.target.name
        let val = e.target.value
    
        setMortgageRow(prev => ({...prev, [name]:val}))
        
    }

    const mortgagePaymentCalc = () => {

        let principle = 0
        let term = 0
        let interestRate = 0
        let propertyTax = 0
        let insurance = 0
        let downPayment = 0
        let wmortgagePayment = 0
       

        principle = parseFloat(mortgageRow["principle"])
        term = parseFloat(mortgageRow["term"])
        interestRate = parseFloat(mortgageRow["interest-rate"])
        propertyTax = parseFloat(mortgageRow["property-tax"])
        insurance = parseFloat(mortgageRow["insurance"])
        downPayment = parseFloat(mortgageRow["down-payment"])

        

        let interest = (parseFloat(interestRate) / 12) / 100

        let newPropertyTax = (parseFloat(propertyTax) / 12)

        
        
        

        let newPrinciple = principle - downPayment
        console.log(downPayment)

        let newTerm = term * 12

        let i1 = Math.pow(1+interest, newTerm)

        // Original math equation 
        // m = P [interest(1+interst)^newTerm] / [(1+interest)^ newTerm - 1]


        wmortgagePayment = newPrinciple * (interest * i1)/(i1 - 1)


        let newMortgagePayment = wmortgagePayment + insurance

        setMortgagePayment(newMortgagePayment.toFixed(2))

        console.log(newMortgagePayment)
        

        
    }

    return (
        <div className="mortgage-calculator">
            <h1 className="header">Mortgage Calculator</h1>
            <h3 className="note">Optional fields use national average if no value is provided.</h3>
            <div className="container">
                <div className="form">
                    <input name="principle" type="number" placeholder="Enter Home Price" className="price" onChange={onChangeMortgage} />
                <select className="dropdown" name="term" id="term" onChange={onChangeMortgage}>
                    <option value="" >Term</option>
                    <option value="30">30 Year</option>
                    <option value="15">15 Year</option>
                    <option value="10">10 Year</option>
                </select>
                <input name="interest-rate" type="number" step={'0.01'} placeholder="APR %" onChange={onChangeMortgage}/>
                <input name="property-tax" type="number" step={'0.01'} placeholder="Property Tax (Optional)" onChange={onChangeMortgage}/>
                <input name="insurance" type="number" step={'0.01'} placeholder="Insurance (Optional)" onChange={onChangeMortgage}/>
                <input name="down-payment" type="number" step={'0.01'} placeholder="Down Payment" onChange={onChangeMortgage}/>
                <select className="dropdown" name="va" id="va">
                    <option value="">VA Loan?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <input name="mortgage-insurance" type="number" step={'0.01'} placeholder="Mortgage Insurance (Optional)" onChange={onChangeMortgage}/>
                </div>
                <div className="btn-container">
                <button className="btn" onClick={mortgagePaymentCalc}>Calculate</button>
                </div>
                <div className="mortgagePayment">
                    ${mortgagePayment} Estimated Mortgage Payment
                </div>
            </div>
        </div>
    )
}

export default MortgageCalculator