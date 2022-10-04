import { useContext, useEffect, useState } from "react"
import DataContext from "../context/dataContext"
import '../components/financialGoals.css'


const FinancialGoals = () => {

    const [inputData, setInputData] = useState({
        "debt_index": 0
    })
    const [userDebts, setUserDebts] = useState([])
    const [goals, setGoals] = useState([])
    let activeBudget = useContext(DataContext).activeBudget

    const getUserDebts = () => {
        let debtIndex = 0
        console.log(activeBudget)
        let debtsCopy = [...userDebts]
        if (activeBudget.expenses){
            activeBudget.expenses.forEach(expense => {
                console.log(expense.expenseName)
                if (expense.expensePriority === '5'){
                    expense['debt_index'] = debtIndex
                    debtIndex += 1
                    let today = new Date()
                    console.log(today)
                    let start = new Date(expense.loan_start_date)
                    console.log(start)
                    let paidYears = today.getFullYear() - start.getFullYear()
                    console.log("Paid years: " + paidYears)
                    let paidMonths = today.getMonth() - start.getMonth()
                    console.log("Paid months: " + paidMonths)
                    // if (today.getMonth() < start.getMonth()){
                    //     paidMonths = paidMonths + 12
                    //     paidYears = paidYears - 1
                    // }
                    expense['months_paid'] = paidMonths
                    expense['balance_before_snowball'] = expense.current_principle_balance
                    let monthsPaid = (paidYears * 12) + paidMonths
                    console.log("years paid: " + paidYears)
                    expense['months_to_paid'] = expense.term - monthsPaid
                    // console.log(monthsPaid)
                    let paidValue = monthsPaid * expense.expenseValue
                    expense['total_payments_made'] = paidValue
                    expense['last_updated_date'] = today.toDateString()
                    expense['new_payoff_date'] = "N/A"
                    debtsCopy.push(expense)
                }
            })
        }
        console.log(debtsCopy)
        setUserDebts(debtsCopy)
    }

    useEffect(() => {
        if (userDebts.length < 1)
        getUserDebts()
    }, [])

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        let copy = {...inputData}
        copy[name] = val
        setInputData(copy)
        console.log(copy)
    }

    const toggle = () => {
        let element = document.querySelector('.add-goal-tool')
        let btn = document.querySelector('.open-add-goal-tool-btn')
        element.classList.toggle('open')
        btn.classList.toggle('open')
    }

    const updateProgressValue = () => {
        let element = document.querySelector('.progress-bar')
        let newWidth = (((userDebts[inputData.debt_index].total_paid) / userDebts[inputData.debt_index].pay_off_value) * 100)
        console.log(newWidth)
        element.style.width =  newWidth + '%'
    }

    const submitGoal = () => {
        updateProgressValue()
    }

    return (
        <div className="financial-goals container">
            <h1 className="header">Financial Goals</h1>

            <button className="open-add-goal-tool-btn" onClick={toggle}>Open Add Goal Tool</button>
            <div className="add-goal-tool">
                <div className="input-container">
                    <input name="title" type="text" className="goal-title input" onChange={onChange} placeholder="Goal Title"/>
                    <select name="goal_type" className="input" onChange={onChange}>
                        <option value="">Goal Type</option>
                        <option value="debt">Debt Goal</option>
                        <option value="savings">Savings Goal</option>
                    </select>


                    {/* -------------- debt menu  ------------ */}


                    {inputData.goal_type === 'debt' &&
                    <>
                        <select name="debt_type" className="input"  onChange={onChange}>
                            <option value="">Specific Debt or Total Debt Goal?</option>
                            <option value='specific'>Specific</option>
                            <option value='total'>Total</option>
                        </select>
                        {inputData.debt_type === 'specific' &&
                        <>
                            {/* map through existing debts in users budget */}
                            <select name="debt_index" className="input" onChange={onChange}>
                                <option value="">Select the debt you wish to set a goal for</option>
                                {
                                    userDebts.map(debt => (
                                        <option key={debt.debt_index} value={debt.debt_index}>{debt.expenseName}</option>
                                    ))}
                            </select>
                            
                        </>
                        }
                    </>
                    }
                    {inputData.goal_type === 'savings' &&
                    <>
                        <input type="number" className="input" step={'0.01'} placeholder="What is your Savings goal?"/>
                    </>
                    }
                </div>
                <div className="btn-container">
                    <button className="add-goal-btn" onClick={submitGoal}>Submit Goal</button>
                </div>
            </div>
            <div className="goals-container">
                {inputData.debt_index &&
                    <>
                        <h3 className="header">{inputData.title}</h3>
                        <div className="goal-graphic-labels">
                            <label>Start</label><label>End</label>
                        </div>
                        <div className="range">
                            <label>${userDebts[inputData.debt_index].loan_amount}</label>
                            <label>0</label>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar">
                                ${userDebts[inputData.debt_index].current_principle_balance}
                            </div>
                        </div>
                        <div className="time-to-goal">You will reach your goal in: {userDebts[inputData.debt_index].months_to_paid} months.</div>
                    </>
                }
            </div>
        </div>
    )
}

export default FinancialGoals