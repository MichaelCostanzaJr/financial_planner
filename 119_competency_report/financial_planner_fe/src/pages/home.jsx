import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../components/home.css"
import DataContext from "../context/dataContext"
import DataService from "../services/dataService"


const Home = () => {

    let navigate = useNavigate()
    let setUserBudgets = useContext(DataContext).setUserBudgets
    let activeBudget = useContext(DataContext).updateActiveBudget
    let user = useContext(DataContext).user

    const loadUserBudgets = async() => {
        let service = new DataService()
        let data = await service.getBudgets(user.user_name)

        setUserBudgets(data)
        activeBudget(data[0])
    }

    useEffect(() => {
        loadUserBudgets()
    }, [])

    const budgetHome = () => {
        let path = '/budget/home'
        navigate(path)
    }
    const mortgageCalculator = () => {
        let path = '/mortgage-calculator'
        navigate(path)
    }

    const autoCalculator = () => {
        let path = '/auto-calculator'
        navigate(path)
    }

    const budgetOptimizer = () => {
        let path = '/budget-optimizer'
        navigate(path)
    }

    const financialGoals = () => {
        let path = '/financial-goals'
        navigate(path)
    }

    const debtSnowball = () => {
        let path = "/debt-snowball"
        navigate(path)
    }

    return (
        <div className="home">
            <div className="container">
                <button className="tile budget-btn" onClick={budgetHome}>Budget</button>
                <button className="tile goals-btn" onClick={financialGoals}>Financial Goals</button>
                <button className="tile ma-tile snowball-tile" onClick={debtSnowball}>Debt Snowball</button>
                <button className="tile ma-tile optimizer-tile" onClick={budgetOptimizer}>Budget Optimization</button>
                <button className="tile alt-tile mortgage-tile" onClick={mortgageCalculator}>Mortgage Calculator</button>
                <button className="tile alt-tile auto-tile" onClick={autoCalculator}>Auto Finance Calculator</button>
            </div>
        </div>
    )
}

export default Home