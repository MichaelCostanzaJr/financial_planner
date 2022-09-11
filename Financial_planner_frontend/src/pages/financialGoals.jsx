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
                if (expense.expensePriority === '2'){
                    expense['debt_index'] = debtIndex
                    debtIndex += 1
                    debtsCopy.push(expense)
                }
            })
        }
        console.log(debtsCopy)
        setUserDebts(debtsCopy)
    }

    useEffect(() => {
        getUserDebts()
    }, [])

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        let copy = {...inputData}
        copy[name] = val
        setInputData(copy)

        // if (inputData.debt_index){
        //     preFillGoalFields(val)
        // }
        console.log(copy)
    }

    // const onDebtSelect = (e) => {
    //     let name = e.target.name
    //     let index = e.target.value

    //     let copy = {...inputData}
    //     copy[name] = index
    //     setInputData(copy)
    //     preFillGoalFields(index)
    // }

    // const preFillGoalFields = (index) => {
    //     let debt = userDebts[index]

    //     console.log(index)
    //     console.log(debt)
    //     let startingValue = document.querySelector('.starting-value')
    //     let totalDebt = debt.expenseValue * debt.term
    //     startingValue.value = totalDebt
    // }

    const toggle = () => {
        let element = document.querySelector('.add-goal-tool')
        let btn = document.querySelector('.open-add-goal-tool-btn')
        element.classList.toggle('open')
        btn.classList.toggle('open')
    }

    return (
        <div className="financial-goals container">
            <h1 className="header">Financial Goals</h1>

            <button className="open-add-goal-tool-btn" onClick={toggle}>Open Add Goal Tool</button>
            <div className="add-goal-tool">
                <div className="input-container">
                    <input name="title" type="text" className="goal-title input" onChange={onChange} placeholder="Goal Title"/>
                    <select name="goal_type" onChange={onChange}>
                        <option value="">Goal Type</option>
                        <option value="debt">Debt Goal</option>
                        <option value="savings">Savings Goal</option>
                    </select>


                    {/* -------------- debt menu  ------------ */}


                    {inputData.goal_type === 'debt' &&
                    <>
                        <select name="debt_type"  onChange={onChange}>
                            <option value="">Specific Debt or Total Debt Goal?</option>
                            <option value='specific'>Specific</option>
                            <option value='total'>Total</option>
                        </select>
                        {inputData.debt_type === 'specific' &&
                        <>
                            {/* map through existing debts in users budget */}
                            <select name="debt_index" onChange={onChange}>
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
                    <button className="add-goal-btn">Submit Goal</button>
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
                            <label>${userDebts[inputData.debt_index].expenseValue * userDebts[inputData.debt_index].term}</label>
                            <label>0</label>
                        </div>
                        <div className="progress-bar">
                            Monthly payment: {userDebts[inputData.debt_index].expenseValue}
                        </div>
                        <div className="time-to-goal">You will reach your goal in: {userDebts[inputData.debt_index].term} months.</div>
                    </>
                }
            </div>
        </div>
    )
}

export default FinancialGoals