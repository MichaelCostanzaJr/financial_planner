import { createContext } from "react";


let DataContext = createContext({

    user: {},
    activeUser: false,

    loginUser: () => {},
    logoutUser: () => {},
    toggleActiveUser: () => {}
})

export default DataContext