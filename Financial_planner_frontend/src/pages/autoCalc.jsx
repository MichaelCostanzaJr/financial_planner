import { useNavigate } from "react-router-dom"
import "../components/autoCalc.css"
import { useState } from 'react';


// come back and fix rounding errors.  convert all numbers to whole numbers, divide any results by 100 when ready to display


const AutoCalculator = () => {

    let navigate = useNavigate()

    const [autoRow, setAutoRow] = useState({
        "insurance": 147.58,
        "tax": 0.08
    })
    const [monthlyPayment, setMonthlyPayment] = useState()
    const [breakdown, setBreakdown] = useState([])

    const onChangeAuto = (e) => {
        let name = e.target.name
        let val = parseFloat(e.target.value)
    
        setAutoRow(prev => ({...prev, [name]:val}))
    }

    const monthPaymentCalc = () => {

        let breakDownCopy = []

        let principle = 0
        let term = 0
        let interestRate = 0
        let insurance = 0
        let tradeIn = 0
        let downPayment = 0
        let interest = 0
        let wmonthlyPayment = 0

        principle = autoRow["principle"]
        breakDownCopy.push(principle.toFixed(2))
        let total = principle
        term = autoRow["term"]
        interestRate = autoRow["interest_rate"]

        if (autoRow.insurance){
            insurance = autoRow["insurance"]
        }else{
            insurance = 0
        }

        if (autoRow.trade_in){
            tradeIn = autoRow.trade_in
            breakDownCopy.push(tradeIn.toFixed(2))
            total -= tradeIn
        }else{
            tradeIn = 0
            breakDownCopy.push(tradeIn.toFixed(2))
        }

        if (autoRow.down_payment){
            downPayment = autoRow.down_payment
            breakDownCopy.push(downPayment.toFixed(2))
            total -= downPayment
        } else {
            downPayment = 0
            breakDownCopy.push(downPayment.toFixed(2))
        }

        interest = (parseFloat(interestRate) / 12) / 100
        
        console.log(interest)

        principle = principle - tradeIn - downPayment

        let tax = principle * autoRow.tax
        console.log(autoRow.tax)
        breakDownCopy.push(tax.toFixed(2))
        total += tax
        breakDownCopy.push(total.toFixed(2))
        console.log(tax)

        principle = principle + tax

        let i1 = Math.pow(1+interest, term)


        wmonthlyPayment = principle * (interest * i1)/(i1 - 1)

        // get values for monthly cost breakdown

        let monthlyInterest = (wmonthlyPayment * term) * interest
        let monthlyPrinciple = wmonthlyPayment - monthlyInterest

        
        breakDownCopy.push(monthlyPrinciple.toFixed(2))
        breakDownCopy.push(monthlyInterest.toFixed(2))
        breakDownCopy.push(insurance.toFixed(2))
        setBreakdown(breakDownCopy)
        console.log(monthlyInterest)
        console.log(monthlyPrinciple)
        console.log(insurance)

        let newMonthlyPayment = wmonthlyPayment + insurance

        setMonthlyPayment(newMonthlyPayment.toFixed(2))

        let payoffAmount = newMonthlyPayment * term
        breakDownCopy.push(newMonthlyPayment.toFixed(2))
        breakDownCopy.push(term)
        breakDownCopy.push(payoffAmount.toFixed(2))

        

        console.log(newMonthlyPayment)
        
    }

    return (
        <div className="auto-calulator">
            <div className="container">
            <h1 className="header">Auto Calculator</h1>
            <h3 className="note">Optional fields use national average if no value is provided.</h3>
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
                    <input name="interest_rate" type="number" step={'0.01'} placeholder="APR %" onChange={onChangeAuto}/>
                    <input name="insurance" type="number" step={'0.01'} placeholder="Insurance Cost (Optional)" onChange={onChangeAuto}/>
                    <input name="trade_in" type="number" step={'0.01'} placeholder="Trade In Value" onChange={onChangeAuto}/>
                    <input name="down_payment" type="number" step={'0.01'} placeholder="Down Payment" onChange={onChangeAuto}/>
                </div>
                <div className="btn-container">
                    <button className="btn" type="submit" onClick={monthPaymentCalc}>Calculate</button>
                </div>
                {monthlyPayment &&
                    <div className="monthly-payment">
                        Monthly Payment ${monthlyPayment} 
                    </div>
                }
                {breakdown.length > 0 &&
                <div className="loan-overview">
                    <h3 className="breakdown-header">Receipt</h3>
                    <div className="receipt">
                        <div className="breakdown-label">Purchase Price</div><div className="breakdown-value">${breakdown[0]}</div>
                        <div className="breakdown-label">Trade-in Value</div><div className="breakdown-value">-${breakdown[1]}</div>
                        <div className="breakdown-label">Down Payment</div><div className="breakdown-value">-${breakdown[2]}</div>
                        <div className="breakdown-label">Sales Tax (est. 8%)</div><div className="breakdown-value">${breakdown[3]}</div>
                        <div className="breakdown-label">Total</div><div className="breakdown-value">${breakdown[4]}</div>
                    </div>

                    <h3 className="breakdown-header">Monthly Breakdown</h3>
                    <div className="breakdown-container">
                        <div className="breakdown-principle-container">
                            <div className="breakdown-label">Principle</div><div className="breakdown-value">${breakdown[5]}</div>
                        </div>
                        <div className="breakdown-interest-container">
                            <div className="breakdown-label">Interest</div><div className="breakdown-value">${breakdown[6]}</div>
                        </div>
                        <div className="breakdown-insurance-container">
                            <div className="breakdown-label">Insurance</div><div className="breakdown-value">${breakdown[7]}</div>
                        </div>
                    </div> 
                    <h3 className="breakdown-header">Payoff Breakdown</h3>
                    <div className="receipt bottom">
                        <div className="breakdown-label">Monthly Payment</div><div className="breakdown-value">${breakdown[8]}</div>
                        <div className="breakdown-label">Payments</div><div className="breakdown-value">{breakdown[9]}</div>
                        <div className="breakdown-label">Payoff Amount</div><div className="breakdown-value">${breakdown[10]}</div>
                    </div>
                </div>
                }
            </div>

        </div>
    )
}



export default AutoCalculator