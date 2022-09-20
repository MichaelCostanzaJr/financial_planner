import { useEffect, useState, useContext } from "react"
import DataContext from "../context/dataContext"
import "../components/debtSnowball.css"


const DebtSnowball = () => {

    const [inputData, setInputData] = useState({
        "debt_index": 0
    })
    const [userDebts, setUserDebts] = useState([])
    const [overpayment, setOverpayment] = useState(0)
    const [snowball, setSnowball] = useState(0)
    const [counter, setCounter] = useState(1)

    let activeBudget = useContext(DataContext).activeBudget

    const getUserDebts = () => {
        let debtIndex = 0
        console.log(activeBudget)
        let debtsCopy = [...userDebts]
        if (activeBudget.expenses){
            activeBudget.expenses.forEach(expense => {
                console.log(expense.expenseName)
                if (expense.expensePriority === '2'){
                    expense['debt_index'] = debtIndex
                    debtIndex += 1
                    let today = new Date()
                    let start = new Date(expense.start_date)
                    let paidYears = today.getFullYear() - start.getFullYear()
                    let paidMonths = today.getMonth() - start.getMonth()
                    let monthsPaid = (paidYears * 12) + paidMonths
                    console.log("years paid: " + paidYears)
                    expense['months_to_paid'] = expense.term - monthsPaid
                    console.log(monthsPaid)
                    let paidValue = monthsPaid * expense.expenseValue
                    expense['paid_value'] = paidValue
                    expense['last_updated_date'] = today.toUTCString()
                    expense['current_balance'] = expense.pay_off_value - expense.paid_value
                    expense['new_payoff_date'] = "N/A"
                    debtsCopy.push(expense)
                }
            })
        }
        console.log(debtsCopy)
        setUserDebts(debtsCopy)
    }

    useEffect(() => {
        if (userDebts.length < 1)
        getUserDebts()
    }, [])

    const setDebtEndPoints = () => {
        //***** Move calculation to backend *****//

        // compute new debt payoff dates based off applied extra payments (Snowball)
        // if paid off loop - debt['new_months_until_paid'] & debt['new_payoff_date']
        let complete = true
        userDebts.forEach(debt => {
            if(debt.pay_off_value > 0){
                complete = false
                let monthlyInterest = debt.expenseValue * (debt.apr / 12)
                let principle = debt.expenseValue - monthlyInterest
    
                principle = snowball + overpayment
                setOverpayment(0)
                debt.pay_off_value -= principle
    
                if (debt.pay_off_value <= 0){
                    setOverpayment(debt.pay_off_value * -1)
                    debt['end_point'] = counter
                    let today = new Date()
                    let payoff_date = new Date(today.setMonth( today.getMonth() + debt.counter))
                    debt['new_payoff_date'] = payoff_date.toUTCString()
                    let newSnowball = snowball + debt.expenseValue
                    setSnowball(newSnowball)
                }
            }
        })

        setCounter(counter + 1)

        if (!complete){
            setDebtEndPoints()
        }

        // monthly payment                                            Get monthly payment
        // * interest rate as percent                                 * get interest rate
        // = monthly interest                                         let monthlyInterest = result
        // monthly payment - interest = principle                     principle = monthlyPayment - monthlyInterest
        // newPrinciple = principle + extraPayment                    newPrinciple = principle + extraPayment
        // new Total balance = total balance - newPrinciple           newTotatBalance = totalBalance - newPrinciple

        // add key to debt object to store debtsnowball amount -- default to user input for first debt -- 0 if none provided
        // add usestate boolean to track overpayment.  
        // add usestate to hold overpayment value
        // apply overpayment to next debt and switch overpayment back to false
        // check if balance <= 0
    }

    const onChange = (e) => {

        let val = e.target.val

        if (val){
            setSnowball(val)
        }
    }

    const updateProgressValue = () => {
        // let element = document.querySelector('.debt-display')
        let elements = document.querySelectorAll('.debt-display')

        for (let i = 0; i < elements.length; i++){
            // let newWidth = (parseFloat(userDebts[i].end_point) / parseFloat(userDebts[i].months_to_paid)) * 100
            let newWidth = 50
            console.log(newWidth)
            elements[i].style.width =  newWidth + '%'
        }
    }

    const applySnowball = () => {
        // setDebtEndPoints()
        updateProgressValue()
    }

    return (
        <div className="debt-snowball container">
            <div className="input-container">
                <label className="snowball-amount-label">Apply Extra Payment</label>
                <input name="snowball" className="snowball" type="number" step={'0.01'} placeholder="Amount" onChange={onChange}/>
            </div>
            <div className="btn-container">
                <button className="snowball-btn btn" onClick={applySnowball}>Apply Snowball</button>
            </div>
            <div className="debt-list">
                {userDebts &&
                    userDebts.map(debt => (
                        <div key={debt.debt_index} className="debt-card">
                            <div className="debt-title-container">
                                <h4 className="debt-title">{debt.expenseName}</h4>
                            </div>
                            <div className="debt-range">
                                <label className="range-lable">{debt.current_balance}</label>
                                <label className="range-lable">0</label>
                            </div>
                            <div className="debt-display-container">
                                <div className="debt-display">
                                    New 0
                                </div>
                            </div>
                            <div className="debt-info">
                                New payoff date: {debt.new_payoff_date}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DebtSnowball