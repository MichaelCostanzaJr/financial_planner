import logo from "../img/logo-no-bg.png"
import DataService from "../services/dataService"
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {

    const[user, setUser] = useState({})
    let navigate = useNavigate()

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        setUser(prev => ({...prev, [name]:val}))
    }

    const login = async(e) => {
        e.preventDefault()
        let service = new DataService()
        let data = await service.login({
            "user_name": user.user_name,
            "user_password": user.user_password
        })

        console.log(data)

        if(data["user_name"] === user.user_name){
            let path = "/home"
            navigate(path)
        }
    }


    return (

        <div className="login">
            <h1 className="header">Financial Planner</h1>
            <img src={logo} alt="" className="logo" />
            <div className="container">
                <div className="form">
                    <input type="text" name="user_name" onChange={onChange} placeholder="Username" />
                    <input type="password" name="user_password" onChange={onChange} placeholder="Password" />
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={login}>Login</button>
                    <button className="btn">Register</button>
                </div>
                <div className="recovery">
                    <button className="btn-recovery">Forgot User Name</button>
                    <button className="btn-recovery">Forgot Password</button>
                </div>
            </div>
                
        </div>

    )

}

export default Login