import { useState, useEffect } from "react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import DataContext from "../context/dataContext"
import "../components/budgetOptimizer.css"



const BudgetOptimizer = () => {

    let budgets = useContext(DataContext).userBudgets
    let updateActiveBudget = useContext(DataContext).updateActiveBudget
    let activeBudget = useContext(DataContext).activeBudget
    let [userBudgets, setUserBudgets] = useState({})
    let [budget, setBudget] = useState({})
    let [optimizationMethod, setOptimizationMethod] = useState('')
    let [goal, setGoal] = useState(0)
    let [surplusOption, setSurplusOption] = useState('')

    let navigate = useNavigate()

    // const [activeBudget, setActiveBudget] = useState({})

    const populateNewExpenseValueFields = () => {
        let copy = [...budgets]
        copy.forEach(budget => {
            budget.expenses.forEach(expense => {
                expense['new_value'] = expense['expenseValue']
            })
        })
        setUserBudgets(copy)
    }

    const loadUserBudget = () => {
        let copy = {...activeBudget}
        if (copy.expenses){
            copy.expenses.forEach(expense => {
                expense['new_value'] = expense['expenseValue']
            })
            console.log(copy)
            setBudget(copy)
        }
    }

    useEffect(() => {
        if(budgets){
            populateNewExpenseValueFields()
            loadUserBudget()
        }
    }, [])

    const onChange = (e) => {
        let val = e.target.value

        budgets.forEach(budget => {
            if (budget.title === val){
                updateActiveBudget(budget)
                setBudget(budget)
            }
        })

        budget.expenses.forEach(expense => {
            expense['new_value'] = expense['expenseValue']
        })
    }

    const onOptimizeSelect = (e) => {
        let val = e.target.value
        setOptimizationMethod(val)
    }

    const onSurplusOptionChange = (e) => {
        let val = e.target.value
        setSurplusOption(val)
    }

    const onGoalChange = (e) => {
        let val = e.target.value
        setGoal(val)
    }

    const optimize = () => {
        // move logic to backend.  Pre-sort expense list to greatly simplify operation
        reset()

        let neededCuts = goal - activeBudget.surplus
        let luxuryExpenses = []
        let lowPriorityExpenses = []
        let mediumPriorityExpenses = []
        let copy = {...activeBudget}
        let message = ''
        
        if (optimizationMethod === 'surplus'){
            if (goal < activeBudget.surplus){
                return alert("You are already meeting your goal. Great job!")
            }
            console.log(surplusOption)
            if (surplusOption === 'priority'){
                copy.expenses.forEach(expense => {
                    if (neededCuts > 0){
                        if (expense.expensePriority === '6'){
                            neededCuts = neededCuts - expense.expenseValue
                            expense['new_value'] = 0
                        }
                    }
                })
                if (neededCuts > 0){
                    copy.expenses.forEach(expense => {
                        if (neededCuts > 0){
                            if (expense.expensePriority === '5'){
                                neededCuts = neededCuts - expense.expenseValue
                                expense['new_value'] = 0
                            }
                        }
                    })
                }
                if (neededCuts > 0){
                    copy.expenses.forEach(expense => {
                        if (neededCuts > 0){
                            if (expense.expensePriority === '4'){
                                neededCuts = neededCuts - expense.expenseValue
                                expense['new_value'] = 0
                            }
                        }
                    })
                }

                if (neededCuts > 0){
                    setBudget(activeBudget)
                    return alert("Unable to optimize your budget. Make more money or input a more realistic goal")
                }

                let newExpenseTotal = 0
                copy.expenses.forEach(expense => {
                    newExpenseTotal = newExpenseTotal + expense.new_value
                })

                let newSurplus = 0
                newSurplus = copy.income_total - newExpenseTotal
                copy['new_surplus'] = newSurplus
                console.log(copy)
                setBudget(copy)
            }else{
                let luxuryValue = 0
                let luxuryCount = 0
                let luxurySpread = 0
                let lowValue = 0
                let lowCount = 0
                let lowSpread = 0
                let mediumValue = 0
                let mediumCount = 0
                let mediumSpread = 0

                copy.expenses.forEach(expense => {
                    if (expense.expensePriority === '6'){
                        luxuryValue += expense.expenseValue
                        luxuryCount += 1
                    }
                    if (expense.expensePriority === '5'){
                        lowValue += expense.expenseValue
                        lowCount += 1
                    }
                    if (expense.expensePriority === '4'){
                        mediumValue += expense.expenseValue
                        mediumCount += 1
                    }
                })

                if (luxuryValue >= neededCuts){
                    luxurySpread = neededCuts / luxuryCount
                    neededCuts = 0
                }else{
                    luxurySpread = luxuryValue / luxuryCount
                    neededCuts -= luxuryValue
                }
                console.log("Needed cuts: " + neededCuts)
                let topup = 0
                if (luxuryCount > 0){
                    copy.expenses.forEach(expense => {
                        if(expense.expensePriority === '6'){
                            luxuryCount -= 1
                            if( expense['expenseValue'] < luxurySpread){
                                topup = luxurySpread - expense['new_value']
                                if (luxuryCount > 1){
                                    luxurySpread = luxurySpread + (topup / luxuryCount)
                                }else{
                                    luxurySpread += topup
                                }
                                
                                expense['new_value'] = 0
                            }else{
                                expense['new_value'] -= luxurySpread
                            }
                            topup = 0
                        }
                    })
                }
                
                if (neededCuts > 0 && lowCount > 0) {
                    console.log("Low Spread: " + lowSpread)
                    if (lowValue >= neededCuts){
                        lowSpread = neededCuts / lowCount
                        neededCuts = 0
                    }else{
                        lowSpread = lowValue / lowCount
                        neededCuts -= lowValue
                    }
                    copy.expenses.forEach(expense => {
                        if(expense.expensePriority === '5') {
                            lowCount -= 1
                            if( expense['new_value'] < lowSpread){
                                topup = lowSpread - expense['new_value']
                                if (lowCount > 1){
                                    lowSpread = lowSpread + (topup / lowCount)
                                }
                                topup = 0
                                expense['new_value'] = 0
                            }else{
                                expense['new_value'] = expense['expenseValue'] - lowSpread
                            }
                        }
                    })
                }
                if (neededCuts > 0 && mediumCount > 0){
                    console.log("Low Spread: " + mediumSpread)
                    if (mediumValue >= neededCuts){
                        mediumSpread = neededCuts / mediumCount
                        neededCuts = 0
                    }else{
                        mediumSpread = mediumValue / mediumCount
                        neededCuts -= mediumValue
                    }
                    copy.expenses.forEach(expense => {
                        if(expense.expensePriority === '5') {
                            mediumCount -= 1
                            if( expense['new_value'] < mediumSpread){
                                topup = mediumSpread - expense['new_value']
                                if (mediumCount > 1){
                                    mediumSpread = mediumSpread + (topup / mediumCount)
                                }
                                topup = 0
                                expense['new_value'] = 0
                            }else{
                                expense['new_value'] = expense['expenseValue'] - mediumSpread
                            }
                        }
                    })
                }
                if (neededCuts <= 0){
                    let newExpenseTotal = 0
                    copy.expenses.forEach(expense => {
                        newExpenseTotal += expense['new_value']
                    })

                    let newSurplus = 0
                    newSurplus = copy.income_total - newExpenseTotal
                    copy['new_surplus'] = newSurplus
                    setBudget(copy)
                    return

                }
                alert("Unable to optimize budgets. Make more money or adjust your priorities!")
            }
        }else if (optimizationMethod === 'luxuries'){
            let copy = {...activeBudget}
            copy.expenses.forEach(expense => {
                if (expense.expensePriority === '6'){
                    expense['new_value'] = 0
                }

            })
            let newExpenseTotal = 0
            copy.expenses.forEach(expense => {
                newExpenseTotal += expense['new_value']
            })

            let newSurplus = 0
            newSurplus = copy.income_total - newExpenseTotal
            copy['new_surplus'] = newSurplus
            setBudget(copy)
        }
    }

    const reset = () => {
        loadUserBudget()
    }

    const budgetHome = () => {
        let path = "/budget/home"
        navigate(path)
    }

    return (
        <>
        {!activeBudget &&
            <div className="container">
                <h1 className="header">You must create a budget nefore using this tool.</h1>
                <div className="btn-container">
                    <button className="btn" onClick={budgetHome}>Budget Home</button>
                </div>

            </div>
        }
        {activeBudget &&

        <div className="budget-optimizer container">
            <h1 className="header">Budget Optimizer</h1>
            <div className="budgets">
                <h3 className="title">Select a Budget to Optimize</h3>
                <select name="budget_select" className="budget-select" onChange={onChange}>
                    <option value=""></option>
                {
                    budgets.map(budget => (
                        <option key={budget._id} value={budget.title}>{budget.title}</option>
                ))}
                </select>
            </div>
            <div className="optimizer-options ">
                <h3 className="current-surplus">Current Surplus: <span className="surplus-span">{budget['surplus']}</span></h3>
                <h3 className="title">Select an Optimization Method</h3>
                <select name="optimization-option" className="optimization-option" onChange={onOptimizeSelect}>
                    <option value=""></option>
                    <option value="surplus">Surplus Goal</option>
                    <option value="luxuries">Remove Luxuries</option>
                </select>
                {optimizationMethod === 'surplus' &&
                    <div className="form">
                        <select name="surplus-type" className="optimization-option surplus-option" onChange={onSurplusOptionChange}>
                            <option value=""></option>
                            <option value="priority">By Priority</option>
                            <option value="spread">Spread Out</option>
                        </select>
                        <input type="number" placeholder="Enter Your Surplus Goal" step={'0.01'} onChange={onGoalChange}/>
                    </div>
                }
                <div className="btn-container">
                    <button onClick={optimize}>OPTIMIZE</button>
                    <button onClick={reset} >RESET</button>
                </div>
            </div>
            <div className="active-budget">
                <h3 className="expense-header">Current Expenses</h3>
                <div className="headers">
                    <div className="header header-1">Expense</div>
                    <div className="header">Current</div>
                    <div className="header header-3">New</div>
                </div>
                <div className="expense-optimizer-table expense-table">
                    {budget.expenses &&
                        budget.expenses.map(item => (
                            // <Row key={item.index} type="expense" id={item.index} data={item}></Row>
                            <div key={item.index + 'new'} className="expense-container">
                                <div key={item.expenseName + 'old'} className="row-name budget-data">{item.expenseName} / {item.expensePriority}</div>
                                <div key={item.index + item.expenseName} className="expense">${parseFloat(item.expenseValue).toFixed(2)}</div>
                                {
                                    item.expenseValue > item.new_value &&
                                    <div key={item.index + item.expenseValue} className="new-value adjusted">${parseFloat(item.new_value).toFixed(2)}</div>
                                }
                                {
                                    item.expenseValue === item.new_value &&
                                    <div key={item.priority + "new"} className="new-value">${parseFloat(item.new_value).toFixed(2)}</div>
                                }
                            </div>
                            // 
                        ))
                    }
                </div>
                <div className="new-surplus-container">
                    <div className="new-surplus-label">New Surplus</div>
                    <div className="new-surplus">{parseFloat(budget.new_surplus).toFixed(2)}</div>
                </div>
            </div>
        </div>
        }
    </>
    )
}

export default BudgetOptimizer