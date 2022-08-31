import { useState } from "react";
import DataContext from "./dataContext"

const GlobalDataProvider = (props) => {

    const [user, setUser] = useState({})
    const [activeUser, setActiveUser] = useState(false)

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

    return (
        <DataContext.Provider value={{

            user: user,
            activeUser: activeUser,

            loginUser: loginUser,
            logoutUser: logoutUser,
            toggleActiveUser: toggleActiveUser

        }}>
            {props.children}
            </DataContext.Provider>
    )

}

export default GlobalDataProvider