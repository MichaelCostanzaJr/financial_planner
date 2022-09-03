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
            dumpActiveBudget: dumpActiveBudget

        }}>
            {props.children}
            </DataContext.Provider>
    )

}

export default GlobalDataProvider