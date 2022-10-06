import DataService from "../services/dataService"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../components/login.css"


const RecoverPasswordReset = () => {

    const [passwordData, setPasswordData] = useState({})

    let navigate = useNavigate()

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        setPasswordData(prev => ({...prev, [name]:val}))
    }

    const reset = async() => {

        let newPassword = document.querySelector('.new-password')
        let confirmPassword = document.querySelector('.confirm-password')

        if (newPassword.value !== confirmPassword.value){
            fieldError()
            return
        }

        let service = new DataService()
        let response
        if (!passwordData.temp_password || !passwordData.new_password){
            response = await service.resetPassword({
                "temp_password": "f",
                "new_password": "f"
            })
        }else{
            response = await service.resetPassword(passwordData)
        }

        console.log(response)

        if (response[0] === true){
            let path = "/recovery/reset-password-success"
            navigate(path)
        }else{
            fieldError()
        }

    }

    const fieldError = () => {
        let fields = document.querySelectorAll('.error-field')

        fields.forEach(field => {
            field.classList.add("error")
        })
    }

    return (

        <div className="recover-password-reset">
            <div className="container">
                <h1 className="header">Reset Password</h1>
                <h3 className="text">Check your email for your temporary password</h3>
                <div className="form">
                    <input name="temp_password" className="temp-password error-field input" onChange={onChange} type="text" placeholder="Enter temporary/current password"/>
                    <input name="new_password" className="new-password error-field input" onChange={onChange} type="password" placeholder="Enter a new password"/>
                    <input className="confirm-password error-field input" type="password" placeholder="Enter new password again"/>
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={reset}>Reset</button>
                </div>
            </div>
        </div>

    )
}

export default RecoverPasswordReset