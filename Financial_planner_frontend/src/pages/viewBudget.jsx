import { useContext } from "react"
import DataContext from "../context/dataContext"
import Budget from "../components/budget"


const ViewBudget = () => {

    // let activeBudget = useContext(DataContext).activeBudget

    return (

        <div className="view-budget">
            <Budget></Budget>
        </div>
    )
}

export default ViewBudget