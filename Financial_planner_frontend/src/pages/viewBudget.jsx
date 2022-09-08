import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import DataContext from "../context/dataContext"
import Budget from "../components/budget"
import DataService from "../services/dataService"
import { useState } from "react"
import "../components/viewBudget.css"


const ViewBudget = () => {

    let activeBudget = useContext(DataContext).activeBudget
    let activeUser = useContext(DataContext).user
    const [deleteWarning, setDeleteWarning] = useState(false)

    let navigate = useNavigate()

    const deleteBudget = async() => {
        let service = new DataService()
        let response = await service.deleteActiveBudget(activeUser.user_name, activeBudget)

        if (!response[0]){
            alert(response[1])
            return
        }
        alert(response[1] + "\nClick ok to return to the budget home page.")

        let path = '/budget/home'
        navigate(path)

    }

    const toggleDeleteWarning = () => {
        if (deleteWarning){
            setDeleteWarning(false)
        }else{
            setDeleteWarning(true)
        }
    }

    const cancel = () => {
        toggleDeleteWarning()
    }
    return (

        <div className="view-budget">
            <Budget></Budget>
            {deleteWarning &&
                <div className="confirm-background form">
                    <div className="confirm-container container">
                        <h3 className="header">Are you sure you want to delete {activeBudget.title}?</h3>
                        <div className="container btn-container">
                            <button className="btn" onClick={deleteBudget}>Confirm</button>
                            <button className="btn" onClick={cancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
            <div className="container btn-container">
                <button className="btn" onClick={toggleDeleteWarning}>Delete Budget</button>
            </div>
        </div>
    )
}

export default ViewBudget