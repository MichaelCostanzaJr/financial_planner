import { useState, useContext } from "react"
import DataContext from "../context/dataContext"
import "../components/addRowTool.css"
import { useEffect } from "react"

const AddRowTool = (props) => {

    let budget = useContext(DataContext).activeBudget
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
        "apr": 0,
        "expenseName": '',
        "expenseValue": 0,
        "expensePriority": '',
        "term": 0,
        "index": props.index,
        "pay_off_value": 0,
        "start_date": '',
        "last_update_date": '',
        "pay_off_date": ''
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
        if (expenseRow.expenseName && expenseRow.expenseValue && expenseRow.expensePriority){
            let copy = {...expenseRow}
            copy['index'] = props.index
            // convert values to numbers for calculations in other places
            let expenseParsed = parseFloat(expenseRow['expenseValue'])
            copy['expenseValue'] = parseFloat(expenseParsed.toFixed(2))
            copy['term'] = parseFloat(expenseRow['term'])
            copy['apr'] = parseFloat(expenseRow.apr)

            // convert date for math later
            let startDate = new Date(copy['start_date'])
            let today = new Date()
            copy['start_date'] = startDate.toUTCString()
            copy['last_update_date'] = today.toUTCString()

            // calculate payoff value
            let payOff = copy.term * copy.expenseValue
            copy['pay_off_value'] = payOff

            // calculate payoff date
            let payoff_date = new Date(startDate.setMonth( startDate.getMonth() + copy.term))
            copy['pay_off_date'] = payoff_date.toUTCString()
            console.log(payoff_date)

            props.getIndex()
            insertExpenseRow(copy)
            setExpenseRow({})
            clearInputs()
            console.log(copy)
            // let lapsedTime = new Date(new Date(copy['last_update_date']) - new Date(copy['start_date']))
            // console.log(lapsedTime.getMonth())
        }else{
            alert("You must complete all fields")
        }
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
                        <input name="expenseName" type="text" className="expenseName input required" onChange={onChangeExpense} placeholder="Expense Name"/>
                        <input name="expenseValue" type="number" className="value input required" onChange={onChangeExpense} step={'0.01'} placeholder="$0.00"/>
                        <select name="expensePriority" onChange={onChangeExpense} className="expensePriority input required">
                            <option value="default">Priority</option>
                            <option className="option" value="1">1 - required</option>
                            <option className="option" value="2">2 - financed</option>
                            <option className="option" value="3">3 - high</option>
                            <option className="option" value="4">4 - medium</option>
                            <option className="option" value="5">5 - low</option>
                            <option className="option" value="6">6 - luxury</option>
                        </select>
                        {expenseRow.expensePriority == '2' &&
                        <>
                            <div className="label">Loan data</div>
                            <input name="apr" type='number' onChange={onChangeExpense} className='input' step={'0.01'} placeholder="APR %"/>
                            <input name="term" type="number" onChange={onChangeExpense} className='input' step={'1'} placeholder="Loan Length (Months)"/>
                            <label className="label">Loan Start Date</label>
                            <input name="start_date" type="date" className="input" onChange={onChangeExpense}/>
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