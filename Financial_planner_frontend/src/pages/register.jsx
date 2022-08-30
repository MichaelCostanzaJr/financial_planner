import { useState } from "react"
import DataService from "../services/dataService"


const Register = () => {
    const [user,setUser] = useState({})

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        setUser(prev => ({...prev, [name]:val}))
    }

    const saveUser = async() => {
        let service = new DataService()
        if (user.user_password != user.user_re_password){
            alert("Passwords don't match")
            return
        }
        console.log(user)
        let data = await service.postUser(user)
    }




    return (
        <div className="register">
            <h1 className="header">Register</h1>
            <div className="container">
                <div className="form">
                    <input type="text" name="user_email" onChange={onChange} placeholder='Enter Your Email' />
                    <input type="text" name="user_name" onChange={onChange} placeholder='Create a User Name' />
                    <input type="text" name="user_password" onChange={onChange} placeholder='Enter a Password' />
                    <input type="text" name="user_re_password" onChange={onChange} placeholder='Re Enter Password' />
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={saveUser}>Register</button>
                    <button className="btn">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Register