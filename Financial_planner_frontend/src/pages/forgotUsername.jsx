import { useNavigate } from "react-router-dom"
import { useState } from "react"
import DataService from "../services/dataService"
import "../components/login.css"

function RecoverUsername () {

    const [email, setEmail] = useState('')

    let navigate = useNavigate()

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        setEmail(prev => ({...prev, [name]:val}))
    }

    const send = async() => {

        let service = new DataService()
        let response
        if (!email['user_email']){
            response = await service.recoverUsername({
                "user_email": "f"
            })
        }else{
            response = await service.recoverUsername(email)
        }
        
        console.log(response)

        if (response[0] === true){
            let path = '/recovery/success'
            navigate(path)
        }else{
            let userName = document.querySelector('.user-email')
            userName.classList.add("error")
        }
    }

    const cancelRecovery = () => {
        let path = '/'
        navigate(path)
    }

    return (
        <div className="recover-username">
            <div className="container">
                <h1 className="header">Recover Username</h1>
                <div className="form">
                    <input className="user-email input" name="user_email" onChange={onChange} type="text" placeholder="Enter Your Email"/>
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={send}>Send</button>
                    <button className="btn cancel-btn" onClick={cancelRecovery}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default RecoverUsername