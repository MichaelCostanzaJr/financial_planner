import { useState, useContext } from "react"
import DataContext from "../context/dataContext"
import "../components/addRowTool.css"

const AddRowTool = (props) => {

    const [incomeRow, setIncomeRow] = useState({})
    const [expenseRow, setExpenseRow] = useState({})

    let activeBudget = useContext(DataContext).activeBudget
    let updateActiveBudget = useContext(DataContext).updateActiveBudget

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

    return (
        <div className="add-row-tool">
            <div className="toggle-container">
                {props.type === 'income' &&
                <>
                <button className="toggle-show-btn income-show-btn" onClick={toggle}>Open Add Income Tool</button>
                    <div className="income-input-container">
                        <input name="source" type="text" className="source input" onChange={onChangeIncome} placeholder="Income Source"/>
                        <input name="value" type="number" className="value input" onChange={onChangeIncome} step={'0.01'} placeholder="$0.00"/>
                        <select name="frequency" onChange={onChangeIncome} className="frequency input">
                            <option className="option" value="monthly">monthly</option>
                            <option className="option" value="hr">hr</option>
                            <option className="option" value="weekly">weekly</option>
                            <option className="option" value="bi-weekly">bi-weekly</option>
                            <option className="option" value="1st and 15th">1st and 15th</option>
                            <option className="option" value="annually">annually</option>
                        </select>
                        {incomeRow.frequency === 'hr' &&
                        <>
                            <div>How many hours do you work each week?</div>
                            <input name="hours" type='number' onChange={onChangeIncome} className='input' step={'1'} placeholder="# of hours a week"/>
                        </>
                        }
                        <button className="add-row-btn">Add Row</button>
                    </div>
                </>
                }
                {props.type === 'expense' &&
                <>
                <button className="toggle-show-btn expense-show-btn" onClick={toggle}>Open Add Expense Tool</button>
                    <div className="expense-input-container">
                        <input name="expenseName" type="text" className="expenseName input" onChange={onChangeExpense} placeholder="Expense Name"/>
                        <input name="expenseValue" type="number" className="value input" onChange={onChangeExpense} step={'0.01'} placeholder="$0.00"/>
                        <select name="expensePriority" onChange={onChangeExpense} className="expensePriority input">
                            <option className="option" value="1">1 - required</option>
                            <option className="option" value="2">2 - financed</option>
                            <option className="option" value="3">3 - high</option>
                            <option className="option" value="4">4 - medium</option>
                            <option className="option" value="5">5 - low</option>
                            <option className="option" value="6">6 - luxury</option>
                        </select>
                        {expenseRow.expensePriority == '2' &&
                        <>
                            <div>Loan data</div>
                            <input name="apr" type='number' onChange={onChangeExpense} className='input' step={'0.01'} placeholder="APR %"/>
                            <input name="term" type="number" onChange={onChangeExpense} className='input' step={'1'} placeholder="Payment Months Remaining"/>
                        </>
                        }
                    <button className="add-row-btn">Add Row</button>
                    </div>
                </>
                }
            </div>
        </div>
    )
}

export default AddRowTool