import { useNavigate } from "react-router-dom"


const RecoverPasswordResetSuccess = () => {

    let navigate = useNavigate()

    const login = () => {
        let path = "/"
        navigate(path)
    }


    return (

        <div className="recovery-password-reset-success">
            <div className="container">
                <h1 className="header">Password Successfully Reset!</h1>
                <h3 className="text">Click below to try out your new password</h3>
                <div className="btn-container">
                    <button className="btn" onClick={login}>Login</button>
                </div>
            </div>
        </div>

    )
}

export default RecoverPasswordResetSuccess