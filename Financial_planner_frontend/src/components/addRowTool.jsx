import { useState, useContext } from "react"
import DataContext from "../context/dataContext"
import "../components/addRowTool.css"
import { useEffect } from "react"

const AddRowTool = (props) => {

    let budget = useContext(DataContext).activeBudget
    const [isMortgage, setIsMortgage] = useState('')
    // const [index, setIndex] = useState(props.getIndex)

    // useEffect(()=>{
    //     setIndex(props.data)
    // }, [])

    const [incomeRow, setIncomeRow] = useState({
        "hours": 0,
        "frequency": "",
        "source": "",
        "value": 0,
        "index": props.index,
        "fed_income_tax": 0,
        "state_income_tax": 0,
        "social_security": 0,
        "medicare": 0
    })
    const [expenseRow, setExpenseRow] = useState({
        "expenseName": '',
        "expenseValue": 0,
        "expensePriority": '1',
        "index": props.index
    })

    let activeBudget = useContext(DataContext).activeBudget
    let updateActiveBudget = useContext(DataContext).updateActiveBudget
    let insertIncomeRow = useContext(DataContext).addIncomeRow
    let insertExpenseRow = useContext(DataContext).addExpenseRow

    const onChangeIncome = (e) => {
        let name = e.target.name
        let val = e.target.value

        setIncomeRow(prev => ({...prev, [name]:val}))
    }

    const onChangeExpense = (e) => {
        let name = e.target.name
        let val = e.target.value

        if (name === 'is_mortgage'){
            setIsMortgage(val)
        }

        setExpenseRow(prev => ({...prev, [name]:val}))
    }

    const toggle = () => {

        if (props.type === 'income'){
            let element = document.querySelector('.income-input-container')
            let button = document.querySelector('.income-show-btn')
            element.classList.toggle('open')
            if (element.classList.contains('open')){
                button.textContent = "Close Add Income Tool"
            }else{
                button.textContent = "Open Add Income Tool"
            }
        }

        if (props.type === 'expense'){
            let element = document.querySelector('.expense-input-container')
            let button = document.querySelector('.expense-show-btn')
            element.classList.toggle('open')
            if (element.classList.contains('open')){
                button.textContent = "Close Add Expense Tool"
            }else{
                button.textContent = "Open Add Expense Tool"
            }
        }
    }

    const convertToMonthly = () => {

        // fix tax calculation based of frequency 
        
        let value = parseFloat(incomeRow.value)
        let hours = incomeRow.hours
        let newValue = 0
        let deductions = 0
        if (incomeRow.frequency === "monthly"){
            newValue = value
        }else if (incomeRow.frequency === 'hr'){
            newValue = (value * hours) * (52 / 12)
        }else if (incomeRow.frequency === 'weekly'){
            newValue = value * (52 / 12)
        }else if (incomeRow.frequency === "bi-weekly"){
            newValue = value * ((52 / 12) / 2)
        }else if (incomeRow.frequency === "1st and 15th"){
            newValue = value * 2
        }else if (incomeRow.frequency === "annually"){
            newValue = value / 12
        }

        newValue = newValue - (
            parseFloat(incomeRow['fed_income_tax']) + 
            parseFloat(incomeRow['state_income_tax']) + 
            parseFloat(incomeRow['social_security']) + 
            parseFloat(incomeRow['medicare']))

        return parseFloat(newValue.toFixed(2))
    }

    const addIncomeRow = () => {
        if(incomeRow.source && incomeRow.value && incomeRow.frequency){
            let copy = {...incomeRow}
            copy['value'] = parseFloat(convertToMonthly().toFixed(2))
            copy['index'] = props.index
            props.getIndex()
            insertIncomeRow(copy)
            setIncomeRow({})
            clearInputs()
            return
        }
        alert("You must complete all fields")
    }

    const addExpenseRow = () => {

        if ( expenseRow.expensePriority !== '5'){
            if (!expenseRow.expenseName || !expenseRow.expenseValue || !expenseRow.expensePriority){
                return alert('You must complete all fields')
            }
        }

        
        if ( expenseRow.expensePriority === '5'){
            if (!expenseRow.expenseName || !expenseRow.loan_amount || !expenseRow.expensePriority
                || !expenseRow.apr || !expenseRow.term || !expenseRow.loan_start_date){
                    return alert("You must complete all fields")
                }
            expenseRow['expenseValue'] = expenseRow.loan_amount
        }
            
        let copy = {...expenseRow}
        copy['index'] = props.index
        // convert values to numbers for calculations in other places
        let expenseParsed = parseFloat(expenseRow['expenseValue'])
        copy['expenseValue'] = parseFloat(expenseParsed.toFixed(2))

        if ( expenseRow.expensePriority === '5'){

            copy['term'] = parseFloat(expenseRow['term'])
            let interest = (parseFloat(copy['apr']) / 12) / 100
            interest = parseFloat(interest.toFixed(4))
            copy['apr'] = parseFloat(copy['apr'])
            let i1 = Math.pow(1 + interest, copy['term'])
            let monthlyPayment = copy['expenseValue'] * (interest * i1)/(i1 - 1)
    
            
    
            if (copy['is_mortgage'] === 'yes'){
                copy['insurance'] = parseFloat(parseFloat(expenseRow.insurance).toFixed(2))
                copy['mortgage_insurance'] = parseFloat(parseFloat(expenseRow.mortgage_insurance).toFixed(2))
                copy['property_tax'] = parseFloat(parseFloat(expenseRow.property_tax).toFixed(2))
            }
    
            // convert date for math later
            let startDate = new Date(copy['loan_start_date'])
            console.log("original start date: " + startDate.getFullYear())
            let today = new Date()
            copy['loan_start_date'] = startDate.toDateString()
            copy['created_date'] = today.toDateString()
            
            // calculate financed payment info
            let paidYears = today.getFullYear() - startDate.getFullYear()
            console.log(today.getFullYear())
            console.log(startDate.getFullYear())
            console.log("Paid years: " + paidYears)
            let paidMonths = today.getMonth() - startDate.getMonth()
            console.log("today get months: " + today.getMonth())
            console.log("start date months: " + startDate.getMonth())
            console.log("Paid months: " + paidMonths)
            if (today.getMonth() < startDate.getMonth()){
                paidMonths = paidMonths + 12
                paidYears = paidYears - 1
            }
            let monthsPaid = (paidYears * 12) + paidMonths
            copy['months_to_paid'] = copy.term - monthsPaid
    
            let adjustedPayment = parseFloat(monthlyPayment.toFixed(2))
            // if (copy['is_mortgage'] === 'yes'){
            //     adjustedPayment = copy['expenseValue'] - copy['insurance'] - copy['mortgage_insurance'] - (copy['property_tax'] / 12)
            // }
            copy['adjusted_payment'] = adjustedPayment
    
            copy['financed_amount'] = copy['expenseValue']
            let paymentAppliedToInterest = copy['expenseValue'] * ((copy['apr'] / 12) / 100)
            let paymentAppliedToPrinciple = adjustedPayment - paymentAppliedToInterest
            copy['payment_applied_to_interest'] = parseFloat(paymentAppliedToInterest.toFixed(2))
            copy['payment_applied_to_principle'] = parseFloat(paymentAppliedToPrinciple.toFixed(2))
            copy['current_principle_balance'] = parseFloat((copy['financed_amount'] - (paymentAppliedToPrinciple * monthsPaid)).toFixed(2))
            copy['amount_paid_in_interest'] = parseFloat((paymentAppliedToInterest * monthsPaid).toFixed(2))
    
            let monthlyPropertyTax = copy.property_tax / 12
            copy['total_payments_made'] = parseFloat((monthlyPayment * monthsPaid).toFixed(2))
            if (copy.is_mortgage === 'yes'){
                adjustedPayment = adjustedPayment + copy.insurance + copy.mortgage_insurance + monthlyPropertyTax
                copy['expenseValue'] = parseFloat(adjustedPayment.toFixed(2))
            }else{
                copy['expenseValue'] = adjustedPayment
            }
    
            // calculate payoff value
            let payOff = copy.term * adjustedPayment
            console.log("term of loan: " + copy.term + "monthly payment: " + adjustedPayment)
            copy['pay_off_value'] = parseFloat(payOff.toFixed(2))
    
            // calculate payoff date
            let payoff_date = new Date(startDate.setMonth( startDate.getMonth() + copy.term))
            copy['pay_off_date'] = payoff_date.toDateString()
            console.log(payoff_date)
        }


        props.getIndex()
        insertExpenseRow(copy)
        setExpenseRow({})
        clearInputs()
        console.log(copy)
        // let lapsedTime = new Date(new Date(copy['last_update_date']) - new Date(copy['start_date']))
        // console.log(lapsedTime.getMonth())
    }

    const clearInputs = () => {
        let fields = document.querySelectorAll('.input')
        
        fields.forEach(element => {
            element.value = null
            if (element.classList.contains("frequency")){
                element.value = "default"
            }
            if (element.classList.contains("expensePriority")){
                element.value = "default"
            }
        })

        setIncomeRow({
            "hours": 0,
            "frequency": "",
            "source": "",
            "value": 0,
            "index": props.index,
            "fed_income_tax": 0,
            "state_income_tax": 0,
            "social_security": 0,
            "medicare": 0
        })
    }

    return (
        <div className="add-row-tool">
            <div className="toggle-container">
                {props.type === 'income' &&
                <>
                    <button className="toggle-show-btn income-show-btn" onClick={toggle}>Open Add Income Tool</button>
                    <div className="income-input-container">
                        <div className="instruction">Fields with a red border are required</div>
                        <input name="source" type="text" className="source input required" onChange={onChangeIncome} placeholder="Income Source"/>
                        <input name="value" type="number" className="value input required number" onChange={onChangeIncome} step={'0.01'} placeholder="$0.00"/>
                        <select name="frequency" onChange={onChangeIncome} className="frequency input dropdown required">
                            <option value="default">Frequency</option>
                            <option className="option" value="hr">hr</option>
                            <option className="option" value="weekly">weekly</option>
                            <option className="option" value="bi-weekly">bi-weekly</option>
                            <option className="option" value="monthly">monthly</option>
                            <option className="option" value="1st and 15th">1st and 15th</option>
                            <option className="option" value="annually">annually</option>
                        </select>
                        {incomeRow.frequency === 'hr' &&
                        <div className="pop-out">
                            <div className="label hours-label">Hours a week:</div>
                            <input name="hours" type='number' onChange={onChangeIncome} className='input required' step={'1'} placeholder="Hours"/>
                        </div>
                        }
                        <div className="label tax-label">Income Tax</div>
                        <input name="fed_income_tax" type="number" className="fed-tax input number" onChange={onChangeIncome} step={'0.01'} placeholder='Federal'/>
                        <input name="state_income_tax" type="number" className="state-tax input number" onChange={onChangeIncome} step={'0.01'} placeholder='State'/>
                        <div className="fica-label">FICA</div>
                        <input name="social_security" type="number" className="fica-ss input number" onChange={onChangeIncome} step={'0.01'} placeholder='Social Security'/>
                        <input name="medicare" type="number" className="fica-medicare input number" onChange={onChangeIncome} step={'0.01'} placeholder='Medicare'/>
                        <button className="add-row-btn" onClick={addIncomeRow}>Add Row</button>
                    </div>
                </>
                }
                {props.type === 'expense' &&
                <>
                <button className="toggle-show-btn expense-show-btn" onClick={toggle}>Open Add Expense Tool</button>
                    <div className="expense-input-container">
                        <div className="instruction">Fields with a red border are required</div>
                        <div className="basic-expense-info">
                            <input name="expenseName" type="text" className="expenseName input required" onChange={onChangeExpense} placeholder="Expense Name"/>
                            <select name="expensePriority" onChange={onChangeExpense} className="expensePriority input required">
                                <option className="option" value="1">1 - high</option>
                                <option className="option" value="2">2 - medium</option>
                                <option className="option" value="3">3 - low</option>
                                <option className="option" value="4">4 - luxury</option>
                                <option className="option" value="5">5 - financed</option>
                            </select>
                        </div>
                        {expenseRow.expensePriority != '5' &&
                            <>
                                <div className="label">Monthly Expense Amount</div>
                                <input name="expenseValue" type="number" className="value input required" onChange={onChangeExpense} step={'0.01'} placeholder="$0.00"/>
                            </>
                        }
                        {expenseRow.expensePriority == '5' &&
                        <> 
                            <div className="label">Loan Amount</div>
                            <input name="loan_amount" type="number" className="value input required" onChange={onChangeExpense} step={'0.01'} placeholder="$0.00"/>
                            <div className="mortgage-selection-label label">Is this a mortgage?</div>
                             <select name="is_mortgage" className="loan-type input required" onChange={onChangeExpense}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                            <div className="label">Annual Percentage Rate</div>
                            <input name="apr" type='number' onChange={onChangeExpense} className='input required' step={'0.01'} placeholder="APR %"/>
                            <div className="label">Length Of Loan ( Months )</div>
                            <input name="term" type="number" onChange={onChangeExpense} className='input required' step={'1'} placeholder="# Months"/>
                            <label className="label">First Payment Date</label>
                            <input name="loan_start_date" type="date" className="input required" onChange={onChangeExpense}/>
                            {isMortgage == 'yes' &&
                            <>
                                <div className="mortgage-label label">Monthly Insurance</div>
                                <input name="insurance" type="number" className="insurance-field input required" placeholder="Amount" step={'0.01'} onChange={onChangeExpense}/>
                                <div className="mortgage-label label">Annual Property Tax</div>
                                <input name="property_tax" type="number" className="tax-field input required" placeholder="Amount" step={'0.01'} onChange={onChangeExpense}/>
                                <div className="mortgage-label label">Mortgage Insurance</div>
                                <input name="mortgage_insurance" type="number" className="mortgage-insurance-field input required" placeholder="Amount" step={'0.01'} onChange={onChangeExpense}/>
                            </>
                            }
                        </>
                        }
                    <button className="add-row-btn" onClick={addExpenseRow}>Add Row</button>
                    </div>
                </>
                }
            </div>
        </div>
    )
}

export default AddRowTool