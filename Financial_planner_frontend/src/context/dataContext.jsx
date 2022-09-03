import { createContext } from "react";


let DataContext = createContext({

    user: {},
    activeUser: false,
    userBudgets: [],
    activeBudget: {},

    loginUser: () => {},
    logoutUser: () => {},
    toggleActiveUser: () => {},
    setUserBudgets: () => {},
    dumpUserBudgets: () => {},
    updateActiveBudget: () => {},
    dumpActiveBudget: () => {}
})

export default DataContext