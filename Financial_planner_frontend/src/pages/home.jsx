import { useNavigate } from "react-router-dom"
import "../components/home.css"


const Home = () => {

    let navigate = useNavigate()

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

    return (
        <div className="home">
            <div className="container">
                <button className="tile budget-btn" onClick={budgetHome}>Budget</button>
                <button className="tile alt-tile">Debt Snowball</button>
                <button className="tile alt-tile">Budget Optimization</button>
                <button className="tile " onClick={mortgageCalculator}>Mortgage Calculator</button>
                <button className="tile " onClick={autoCalculator}>Auto Finance Calculator</button>
            </div>
        </div>
    )
}

export default Home