import { useNavigate } from "react-router-dom"
import { useState } from "react"
import DataService from "../services/dataService"
import "../components/login.css"

function RecoverPassword() {

    let navigate = useNavigate()

    const [user, setUser] = useState({})

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        setUser(prev => ({...prev, [name]:val}))
    }

    const send = async() => {

        let service = new DataService()
        let response
        if (!user.user_name || !user.user_email){
            response = await service.recoverPassword({
                "user_name": "f",
                "user_email": "f"
            })
            console.log(response)
        }else{
            response = await service.recoverPassword(user)
        }
        
        if (response[0] === true){
            let path = '/recovery/reset-password'
            navigate(path)
        }else{
            let userName = document.querySelector('.user-name')
            userName.classList.add("error")
            let userPassword = document.querySelector('.user-email')
            userPassword.classList.add("error")
        }
    }

    const cancelRecovery = () => {
        let path = '/'
        navigate(path)
    }

    return (
        <div className="recover-password">
            <div className="container">
                <h1 className="header">Recover Password</h1>
                <div className="form">
                    <input className="user-name input" name="user_name" type="text" onChange={onChange} placeholder="Enter Your Username"/>
                    <input className="user-email input" name="user_email" type="text" onChange={onChange} placeholder="Enter Your Email"/>
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={send}>Send</button>
                    <button className="btn cancel-btn" onClick={cancelRecovery}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default RecoverPassword