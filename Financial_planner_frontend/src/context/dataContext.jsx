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
    dumpActiveBudget: () => {},
    addIncomeRow: () => {},
    addExpenseRow: () => {},
    deleteRow: () => {},
    editRow: () => {}
})

export default DataContext