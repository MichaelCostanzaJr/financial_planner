import { useContext, useState, useEffect } from "react"
import DataContext from "../context/dataContext"
import DataService from "../services/dataService"
import "../components/budgetHome.css"


const BudgetHome = () => {

    let setUserBudgets = useContext(DataContext).setUserBudgets
    let userBudgets = useContext(DataContext).userBudgets
    let user = useContext(DataContext).user

    const loadUserBudgets = async() => {
        let service = new DataService()
        let data = await service.getBudgets(user.user_name)

        setUserBudgets(data)
    }

    useEffect(() => {
        loadUserBudgets()
    }, [])

    const viewBudget = () => {

    }

    const newBudget = () => {

    }

    return (
        <div className="budget-home">
            <div className="container">
                <div className="tile new-tile" onClick={newBudget}>New Budget</div>
                    {/* <select className="budgets-dropdown" name="budget_list">
                        {
                            userBudgets.map(budget => (
                                <option className="budget-option" key={budget._id} value={budget._id}>{budget.title}</option>
                            ))
                        }
                    </select> */}
                    {
                        userBudgets.map(budget => (
                            <div  onClick={viewBudget} className="tile sub-tile" key={budget._id} value={budget._id}>
                                <span className="view-span">View </span>{budget.title}</div>
                        ))
                    }
            </div>
        </div>
    )
}

export default BudgetHome