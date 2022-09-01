import { createContext } from "react";


let DataContext = createContext({

    user: {},
    activeUser: false,
    userBudgets: [],

    loginUser: () => {},
    logoutUser: () => {},
    toggleActiveUser: () => {},
    setUserBudgets: () => {},
    dumpUserBudgets: () => {}
})

export default DataContext