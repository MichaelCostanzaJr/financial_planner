import { useContext, useState } from "react"
import DataContext from "../context/dataContext"
import DataService from "../services/dataService"
import "../components/budgetHome.css"


const BudgetHome = () => {

    let budgets = useContext(DataContext).userBudgets

    return (
        <div className="budget-home">
            <div className="container">
                <div className="tile">
                    <button className="btn tile-btn">View Budget</button>
                    <select className="budgets-dropdown" name="budget_list">
                        {
                            budgets && // if budgets is not empty
                            budgets.forEach(budget => {
                                <option className="budget-option" key={budget.id} value={budget.id}>{budget.name}</option>
                            })
                        }
                    </select>
                </div>
                <div className="tile">
                    <button className="btn tile-btn">New Budget</button>
                </div>
            </div>
        </div>
    )
}

export default BudgetHome