import { useNavigate } from "react-router-dom"
import "../components/autoCalc.css"
import { useState } from 'react';

const MortgageCalculator = () => {

    let navigate = useNavigate()

    const [mortgageRow, setMortgageRow] = useState({
        "property-tax": 0,
        "insurance": 0,
        "down-payment": 0
    })

    const [mortgagePayment, setMortgagePayment] = useState(0)
    const [breakdown, setBreakdown] = useState([])

    const onChangeMortgage = (e) => {
        let name = e.target.name
        let val = e.target.value
        if(name !== 'va_loan'){
            val = parseFloat(val)
        }
    
        setMortgageRow(prev => ({...prev, [name]:val}))
        
    }

    const mortgagePaymentCalc = () => {

        let requiredFields = document.querySelectorAll('.required')

        let allRequired = true
        requiredFields.forEach(field => {
            if (!field.value){
                allRequired = false
            }
        })
        if (!allRequired){
            requiredFields.forEach(field => {
                if (!field.value){
                    field.classList.add('error')
                }
            })
            return
        }

        requiredFields.forEach(field => {
                field.classList.remove('error')
        })
        
        // if (!mortgageRow.principle){
        //     let priceField = document.querySelector('.price')
        //     priceField.classList.add('error')
        //     return
        // }

        let newBreakdown = []

        let principle = 0
        let term = 0
        let interestRate
        let propertyTax
        let insurance
        let downPayment
        let mortgageInsurance 
       

        principle = mortgageRow.principle
        newBreakdown.push(principle.toFixed(2))
        term = mortgageRow["term"]
        newBreakdown.push(term)
        interestRate = mortgageRow["interest_rate"]
        newBreakdown.push(interestRate)

        if (mortgageRow["property_tax"]){
            propertyTax = mortgageRow["property_tax"]
            newBreakdown.push(propertyTax.toFixed(2))
        }else{
            propertyTax = parseFloat(0)
            newBreakdown.push(propertyTax.toFixed(2))
        }
        if (mortgageRow.insurance){
            insurance = mortgageRow["insurance"]
            newBreakdown.push(insurance.toFixed(2))
        }else{
            insurance = parseFloat(0)
            newBreakdown.push(insurance.toFixed(2))
        }
        if (mortgageRow["down_payment"]){
            downPayment = mortgageRow["down_payment"]
            newBreakdown.push(downPayment.toFixed(2))
        }else{
            downPayment = parseFloat(0)
            newBreakdown.push(downPayment.toFixed(2))
        }
        if (mortgageRow.mortgage_insurance && mortgageRow.va_loan !== 'yes'){
            mortgageInsurance = mortgageRow.mortgage_insurance
            newBreakdown.push(mortgageInsurance.toFixed(2))
        }else{
            mortgageInsurance = parseFloat(0)
            newBreakdown.push(mortgageInsurance.toFixed(2))
        }

        let interest = (parseFloat(interestRate) / 12) / 100
        console.log("monthly interest: " + interest)

        let newPropertyTax = (parseFloat(propertyTax) / 12)
        newBreakdown.push(newPropertyTax.toFixed(2))
        console.log("property tax: " + newPropertyTax)
        console.log(newPropertyTax)

        
        let newPrinciple = principle - downPayment
        newBreakdown.push(newPrinciple.toFixed(2))
        console.log("principle accruing interest: " + newPrinciple)
        let newTerm = term * 12
        newBreakdown.push(newTerm)
        console.log("Number of Payments: " + newTerm)
        let i1 = Math.pow(1 + interest, newTerm)
        
        let monthlyPrinciple = newPrinciple * (interest * i1)/(i1 - 1)

        //calculate principle minus interest for display later
        newBreakdown.push((monthlyPrinciple - (monthlyPrinciple - (newPrinciple / newTerm))).toFixed(2))

        
        console.log("Monthly principle: " + monthlyPrinciple)
        console.log("Insurance applied: " + insurance)
        console.log("Property Tax applied: " + newPropertyTax)
        console.log("Mortage Insurance applied: " + mortgageInsurance)
        let newMonthlyPayment = monthlyPrinciple + insurance + newPropertyTax + mortgageInsurance

        // calculate monthly interest paid
        newBreakdown.push((monthlyPrinciple - (principle / newTerm)).toFixed(2))


        newBreakdown.push(newMonthlyPayment.toFixed(2))
        console.log("Monthly Payment: " + newMonthlyPayment)

        setMortgagePayment(parseFloat(newMonthlyPayment.toFixed(2)))

        // set payoff value to display in breakdown
        newBreakdown.push((newMonthlyPayment * newTerm).toFixed(2))
        setBreakdown(newBreakdown)
    }

    return (
        <div className="mortgage-calculator container">
            <h1 className="header">Mortgage Calculator</h1>
            <h3 className="note">Optional fields use national average if no value is provided Required fields are outlined in red.</h3>
            <div className="">
                <div className="form">
                    <input name="principle" type="number" placeholder="Enter Home Price" className="price required" onChange={onChangeMortgage} />
                <select className="dropdown required" name="term" id="term" onChange={onChangeMortgage}>
                    <option value="" >Term</option>
                    <option value={30}>30 Year</option>
                    <option value={15}>15 Year</option>
                </select>
                <input name="interest_rate" type="number" step={'0.01'} placeholder="APR %" className="required" onChange={onChangeMortgage}/>
                <select name="va_loan" className="dropdown required" onChange={onChangeMortgage}>
                    <option value="">VA Loan?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <input name="property_tax" type="number" step={'0.01'} placeholder="Annual Property Tax (Optional)" onChange={onChangeMortgage}/>
                <input name="insurance" type="number" step={'0.01'} placeholder="Monthly Insurance (Optional)" onChange={onChangeMortgage}/>
                <input name="down_payment" type="number" step={'0.01'} placeholder="Down Payment" onChange={onChangeMortgage}/>
                <input name="mortgage_insurance" type="number" step={'0.01'} placeholder="Mortgage Insurance (Optional)" onChange={onChangeMortgage}/>
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={mortgagePaymentCalc}>Calculate</button>
                </div>
                {mortgagePayment !== 0 &&
                    <div className="monthly-payment">
                        <span className="amount-color">${mortgagePayment}</span> Estimated Mortgage Payment
                    </div>
                }
            </div>
            {breakdown.length > 0 &&
                <div className="loan-overview">
                    <h3 className="breakdown-header">Mortgage Information</h3>
                    <div className="receipt">
                        <div className="breakdown-label">Purchase Price</div><div className="breakdown-value">${breakdown[0]}</div>
                        <div className="breakdown-label">Down Payment</div><div className="breakdown-value">-${breakdown[5]}</div>
                        <div className="breakdown-label">Financed Amount</div><div className="breakdown-value">${breakdown[8]}</div>
                        <div className="breakdown-label">Term</div><div className="breakdown-value">{breakdown[1]} Years</div>
                        <div className="breakdown-label">Interest Rate</div><div className="breakdown-value">{breakdown[2]}%</div>
                    </div>

                    <h3 className="breakdown-header">Monthly Payment Breakdown</h3>
                    <div className="receipt">
                        <div className="breakdown-label">Principle</div><div className="breakdown-value">${breakdown[10]}</div>
                        <div className="breakdown-label">Interest</div><div className="breakdown-value">${breakdown[11]}</div>
                        <div className="breakdown-label">Insurance</div><div className="breakdown-value">${breakdown[4]}</div>
                        <div className="breakdown-label">Mortgage Insurance</div><div className="breakdown-value">${breakdown[6]}</div>
                        <div className="breakdown-label">Property Taxes</div><div className="breakdown-value">${breakdown[7]}</div>
                        <div className="breakdown-label">Monthly Payment</div><div className="breakdown-value">${breakdown[12]}</div>
                    </div> 
                    <h3 className="breakdown-header">Payoff Breakdown</h3>
                    <div className="receipt bottom">
                        <div className="breakdown-label">Monthly Payment</div><div className="breakdown-value">${breakdown[12]}</div>
                        <div className="breakdown-label">Payments</div><div className="breakdown-value">{breakdown[9]}</div>
                        <div className="breakdown-label">Payoff Amount</div><div className="breakdown-value">${breakdown[13]}</div>
                    </div>
                </div>
                }
        </div>
    )
}

export default MortgageCalculator