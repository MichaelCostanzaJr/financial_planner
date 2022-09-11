import { useState } from "react";
import DataContext from "./dataContext"

const GlobalDataProvider = (props) => {

    const [user, setUser] = useState({})
    const [activeUser, setActiveUser] = useState(false)
    const [budgets, setBudgets] = useState([])
    const [activeBudget, setActiveBudget] = useState({})

    const loginUser = (currentUser) => {
        console.log("Global user logging in")
        
        setUser(currentUser)
        
        console.log(currentUser)
    }

    const logoutUser = () => {
        setUser({})
    }

    const toggleActiveUser = () => {
        if (activeUser === false){
            setActiveUser(true)
        }else{
            setActiveUser(false)
        }
    }

    const setUserBudgets = (budgets) => {
        setBudgets(budgets)
    }

    const dumpUserBudgets = () => {
        setBudgets([])
    }

    const updateActiveBudget = (budget) => {
        setActiveBudget(budget)
    }

    const addIncomeRow = (row) =>{

        // add row to active budget
        let copy = {...activeBudget}
        copy['income'].push(row)

        // calculate new income total
        let newTotal = 0
        copy['income'].forEach(element => {
            newTotal += parseFloat(element['value'])
        });
        copy['income_total'] = parseFloat(newTotal.toFixed(2))

        // calculate new surplus
        let newSurplus = newTotal - copy.expense_total
        copy['surplus'] = parseFloat(newSurplus.toFixed(2))
        setActiveBudget(copy)
    }

    const addExpenseRow = (row) =>{
        let copy = {...activeBudget}
        copy['expenses'].push(row)

        let newTotal = 0
        copy['expenses'].forEach(element => {
            newTotal += element['expenseValue']
        })
        copy['expense_total'] = parseFloat(newTotal.toFixed(2))

        let newSurplus = copy.income_total - copy.expense_total
        copy['surplus'] = newSurplus
        setActiveBudget(copy)
    }

    const deleteRow = (id) => {
        console.log("Attempting to delete row with id: " + id)

        let copy = {...activeBudget}
        let newIncome = []
        let newExpenses = []

        activeBudget['income'].forEach(element => {
            if (element['index'] !== id){
                newIncome.push(element)
            }
        })

        activeBudget['expenses'].forEach(element => {
            if (element['index'] !== id){
                newExpenses.push(element)
            }
        })

        copy['income'] = newIncome
        copy['expenses'] = newExpenses

        // calculate new income total
        let newIncomeTotal = 0
        copy['income'].forEach(element => {
            newIncomeTotal += element['value']
        })
        copy['income_total'] = newIncomeTotal
        
        // calculate new expense total
        let newExpenseTotal = 0
        copy['expenses'].forEach(element => {
            newExpenseTotal += element['expenseValue']
        })
        copy['expense_total'] = newExpenseTotal

        // calculate new surplus
        let newSurplus = copy['income_total'] - copy['expense_total']
        copy['surplus'] = parseFloat(newSurplus.toFixed(2))


        setActiveBudget(copy)
        
    }

    const editRow = (editIndex, editRow) => {
        console.log("Attempting to edit row with index: " + editIndex)

        let copy = {...activeBudget}
        let found = false
        let incomeChanged = false
        let expensesChanged = false

        copy['income'].forEach(element => {
            if (element.index === editIndex){
                if (editRow['name']){
                    element['source'] = editRow['name']
                }
                if (editRow['value']){
                    element['value'] = parseFloat(editRow['value'])
                }
                found = true
                incomeChanged = true
            }
        })

        if (!found){
            copy['expenses'].forEach(element => {
                if (element.index === editIndex){
                    if (editRow['name']){
                        element['expenseName'] = editRow['name']
                    }
                    if (editRow['value']){
                        element['expenseValue'] = parseFloat(editRow['value'])
                    }
                    found = true
                    expensesChanged = true
                }
            })
        }

        if (incomeChanged){
            // calculate new income total
            let newIncomeTotal = 0
            copy['income'].forEach(element => {
                newIncomeTotal += element['value']
            })
            copy['income_total'] = newIncomeTotal
        }
        
        if (expensesChanged){
            // calculate new expense total
            let newExpenseTotal = 0
            copy['expenses'].forEach(element => {
                newExpenseTotal += element['expenseValue']
            })
            copy['expense_total'] = newExpenseTotal
        }

        if (incomeChanged || expensesChanged){
            // calculate new surplus
            let newSurplus = copy['income_total'] - copy['expense_total']
            copy['surplus'] = parseFloat(newSurplus.toFixed(2))
        }

        setActiveBudget(copy)
    }

    const dumpActiveBudget = () => {
        setActiveBudget({})
    }

    return (
        <DataContext.Provider value={{

            user: user,
            activeUser: activeUser,
            userBudgets: budgets,
            activeBudget: activeBudget,

            loginUser: loginUser,
            logoutUser: logoutUser,
            toggleActiveUser: toggleActiveUser,
            setUserBudgets: setUserBudgets,
            dumpUserBudgets: dumpUserBudgets,
            updateActiveBudget: updateActiveBudget,
            dumpActiveBudget: dumpActiveBudget,
            addIncomeRow: addIncomeRow,
            addExpenseRow: addExpenseRow,
            deleteRow: deleteRow,
            editRow: editRow

        }}>
            {props.children}
            </DataContext.Provider>
    )

}

export default GlobalDataProvider