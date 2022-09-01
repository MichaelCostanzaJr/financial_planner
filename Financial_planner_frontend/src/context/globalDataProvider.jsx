import { useState } from "react";
import DataContext from "./dataContext"

const GlobalDataProvider = (props) => {

    const [user, setUser] = useState({})
    const [activeUser, setActiveUser] = useState(false)
    const [budgets, setBudgets] = useState([])

    const loginUser = (currentUser) => {
        console.log("Global user logging in")

        setUser(currentUser)

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
        setUserBudgets(budgets)
    }

    const dumpUserBudgets = () => {

    }

    return (
        <DataContext.Provider value={{

            user: user,
            activeUser: activeUser,
            userBudgets: budgets,

            loginUser: loginUser,
            logoutUser: logoutUser,
            toggleActiveUser: toggleActiveUser,
            setUserBudgets: setUserBudgets,
            dumpUserBudgets: dumpUserBudgets

        }}>
            {props.children}
            </DataContext.Provider>
    )

}

export default GlobalDataProvider