import { useNavigate } from "react-router-dom"
import "../components/mortgageCalc.css"
import { useState } from 'react';

const MortgageCalculator = () => {

    let navigate = useNavigate()

    const [mortgageRow, setMortgageRow] = useState({
        "property-tax": 0,
        "insurance": 0,
        "down-payment": 0
    })

    const [mortgagePayment, setMortgagePayment] = useState(0)

    const onChangeMortgage = (e) => {
        let name = e.target.name
        let val = e.target.value
        if(name !== 'va_loan'){
            val = parseFloat(val)
        }
    
        setMortgageRow(prev => ({...prev, [name]:val}))
        
    }

    const mortgagePaymentCalc = () => {

        let principle = 0
        let term = 0
        let interestRate
        let propertyTax
        let insurance
        let downPayment
        let mortgageInsurance 
        let wmortgagePayment = 0
       

        principle = mortgageRow.principle
        term = mortgageRow["term"]
        interestRate = mortgageRow["interest_rate"]

        if (mortgageRow["property_tax"]){
            propertyTax = mortgageRow["property_tax"]
        }else{
            propertyTax = parseFloat(0)
        }
        if (mortgageRow.insurance){
            insurance = mortgageRow["insurance"]
        }else{
            insurance = parseFloat(0)
        }
        if (mortgageRow["down_payment"]){
            downPayment = mortgageRow["down_payment"]
        }else{
            downPayment = parseFloat(0)
        }
        if (mortgageRow.mortgage_insurance && mortgageRow.va_loan !== 'yes'){
            mortgageInsurance = mortgageRow.mortgage_insurance
        }else{
            mortgageInsurance = parseFloat(0)
        }

        

        let interest = (parseFloat(interestRate) / 12) / 100

        let newPropertyTax = (parseFloat(propertyTax) / 12)

        // console.log("Principle: " + [principle] + " " + principle.type)
        // console.log("term: " + term + " " )
        // console.log("interestRate: " + interestRate + " " + interestRate.type)
        // console.log("propertyTax: " + propertyTax + " " + propertyTax.type)
        // console.log("insurance: " + insurance + " " + insurance.type)
        // console.log("downPayment: " + downPayment + " " + downPayment.type)
    
        console.log(principle)
        let newPrinciple = principle - downPayment + propertyTax + mortgageInsurance
        console.log(newPrinciple)

        let newTerm = term * 12

        let i1 = Math.pow(1 + interest, newTerm)

        // Original math equation 
        // m = P [interest(1+interst)^newTerm] / [(1+interest)^ newTerm - 1]


        wmortgagePayment = newPrinciple * (interest * i1)/(i1 - 1)


        let newMortgagePayment = wmortgagePayment + insurance
        
        console.log(newMortgagePayment)

        setMortgagePayment(parseFloat(newMortgagePayment.toFixed(2)))
        console.log(mortgageRow)
        

        
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
                    <option value={30}>30 Year</option>
                    <option value={15}>15 Year</option>
                </select>
                <input name="interest_rate" type="number" step={'0.01'} placeholder="APR %" onChange={onChangeMortgage}/>
                <input name="property_tax" type="number" step={'0.01'} placeholder="Property Tax (Optional)" onChange={onChangeMortgage}/>
                <input name="insurance" type="number" step={'0.01'} placeholder="Insurance (Optional)" onChange={onChangeMortgage}/>
                <input name="down_payment" type="number" step={'0.01'} placeholder="Down Payment" onChange={onChangeMortgage}/>
                <select name="va_loan" className="dropdown" onChange={onChangeMortgage}>
                    <option value="">VA Loan?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <input name="mortgage_insurance" type="number" step={'0.01'} placeholder="Mortgage Insurance (Optional)" onChange={onChangeMortgage}/>
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