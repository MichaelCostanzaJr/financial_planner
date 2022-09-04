import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import DataContext from "../context/dataContext"
import DataService from "../services/dataService"
import "../components/budgetHome.css"


const BudgetHome = () => {

    let setUserBudgets = useContext(DataContext).setUserBudgets
    let activeUser = useContext(DataContext).user
    let setActiveBudget = useContext(DataContext).updateActiveBudget
    let userBudgets = useContext(DataContext).userBudgets
    let user = useContext(DataContext).user
    let navigate = useNavigate()

    const loadUserBudgets = async() => {
        let service = new DataService()
        let data = await service.getBudgets(user.user_name)

        setUserBudgets(data)
    }

    useEffect(() => {
        loadUserBudgets()
    }, [])

    const newBudget = () => {
        setActiveBudget({
            "title": '',
            "income": [],
            "expenses": [],
            "income_total": 0.00,
            "expense_total": 0.00,
            "surplus": 0.00,
            "owner": activeUser['user_name'],
            "next_index": 0
        })
        let path = "/new-budget"
        navigate(path)
    }

    return (
        <div className="budget-home">
            <div className="container">
                <div className="tile new-tile" onClick={newBudget}>New Budget</div>
                
                    {
                        userBudgets.map(budget => (
                            <div className="tile sub-tile" key={budget._id} value={budget._id} onClick={() => {
                                setActiveBudget(budget)
                                let path = "/view-budget"
                                navigate(path)
                            }}>
                                <span className="view-span">View </span>{budget.title}</div>
                        ))
                    }
                
            </div>
        </div>
    )
}

export default BudgetHome