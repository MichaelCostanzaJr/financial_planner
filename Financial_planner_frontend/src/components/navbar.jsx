import { useNavigate } from "react-router-dom";
import "./navbar.css";
import Toggle from "../components/toggle"

const Navbar = () => {

    let navigate = useNavigate()

    let toggle_menu = (e, currentDropDown) => {
        currentDropDown = e.target.closest('[data-dropdown]')
        currentDropDown.classList.toggle('active')
        toggleButtonClickable()
    }

    let menu_Click = (e) => {
        const isPopOutLink = e.target.matches('[data-dropdown-button]')
        let currentDropDown
        if (isPopOutLink){
            toggle_menu(e, currentDropDown)
        }else if (e.target.matches('.reg-btn')){
            toggle_menu(e, currentDropDown)
            let path = '/register'
            navigate(path)
        }else if (e.target.matches('.log-out')){
            toggle_menu(e, currentDropDown)
            let path = '/'
            navigate(path)
        }else if (e.target.matches('.home')){
            toggle_menu(e, currentDropDown)
            let path = '/home'
            navigate(path)
        }
    }

    const toggleButtonClickable = () => {
        let buttons = document.querySelectorAll('button')

        buttons.forEach(btn => {
            if (btn.disabled){
                btn.disabled = false
                btn.style.cursor = "pointer"
            }else{
                btn.disabled = true
                btn.style.cursor = "default"
            }
        })
    }

    return (
        <div className="navbar">
            <div className="navbar-hamburger-container" data-dropdown>
                <div className="hamburger-container" onClick={menu_Click} data-dropdown-button>
                    <div className="hamburger" data-dropdown-button></div>
                </div>
                <div className="pop-out-link">
                    <Toggle/>
                    {/* This section will contain javascript to check if user is logged in and display different buttons depending on if user logged in or not */}
                    <div onClick={menu_Click} className="dont-disable log-out">Login</div>
                    <div onClick={menu_Click} className="dont-disable reg-btn">Register</div>
                    <div onClick={menu_Click} className="dont-disable home">Home</div>
                </div>
            </div>
        </div>
    )
}

export default Navbar