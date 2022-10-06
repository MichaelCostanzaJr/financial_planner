import { useState, useEffect } from "react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import DataContext from "../context/dataContext"
import "../components/budgetOptimizer.css"
import DataService from "../services/dataService"



const BudgetOptimizer = () => {

    let budgets = useContext(DataContext).userBudgets
    let updateActiveBudget = useContext(DataContext).updateActiveBudget
    let activeBudget = useContext(DataContext).activeBudget
    let [userBudgets, setUserBudgets] = useState({})
    let [budget, setBudget] = useState({})
    let [optimizationMethod, setOptimizationMethod] = useState('')
    let [goal, setGoal] = useState(1)
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
            setGoal(copy.surplus + 1)
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
        val = parseFloat(val)
        setGoal(val)
    }

    const optimize = async() => {
        // move logic to backend.  Pre-sort expense list to greatly simplify operation
        // send activeBudget expenses only
        reset()

        let copy = {...activeBudget}
        let payload = []
        payload.push(optimizationMethod)
        payload.push(goal)
        payload.push(activeBudget.surplus)
        payload.push(activeBudget.expenses)

        console.log(payload)

        let service = new DataService()
        let data = await service.optimize(payload)

        if (data[0] === true){

            let copy = {...budget}
            copy['expenses'] = data[1]
            copy['new_surplus'] = data[2]

            setBudget(prev => prev = copy)
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
                    <option value="surplus_priority">Surplus by Priority</option>
                    <option value="surplus_spread">Surplus by Spread</option>
                    <option value="luxuries">Remove Luxuries</option>
                </select>
                {optimizationMethod !== 'luxuries' &&
                    <div className="form">
                        <input type="number" className="input" placeholder="Enter Your Surplus Goal" step={'0.01'} onChange={onGoalChange}/>
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