import { useEffect, useState, useContext } from "react"
import DataContext from "../context/dataContext"
import DataService from "../services/dataService"
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
                    let start = new Date(expense.loan_start_date)
                    let paidYears = today.getFullYear() - start.getFullYear()
                    let paidMonths = today.getMonth() - start.getMonth()
                    if (today.getMonth() < start.getMonth()){
                        paidMonths = paidMonths + 12
                        paidYears = paidYears - 1
                    }
                    expense['months_paid'] = paidMonths
                    let monthsPaid = (paidYears * 12) + paidMonths
                    console.log("years paid: " + paidYears)
                    expense['months_to_paid'] = expense.term - monthsPaid
                    // console.log(monthsPaid)
                    let paidValue = monthsPaid * expense.expenseValue
                    expense['total_payments_made'] = paidValue
                    expense['last_updated_date'] = today.toDateString()
                    if (expense.is_mortgage === 'yes'){
                        let adjustedPayment = expense.expenseValue - expense.insurance - expense.mortgage_insurance - (expense.property_tax / 12)
                        let newCurrentPrincipleBalance = (expense.current_principle_balance - (adjustedPayment * monthsPaid)).toFixed(2)
                        expense['current_principle_balance'] = parseFloat(newCurrentPrincipleBalance)
                    }
                    expense['new_payoff_date'] = "N/A"
                    debtsCopy.push(expense)
                }
            })
            let changesNeeded = true
            while (changesNeeded){
                changesNeeded = false
                for (let i = 1; i < debtsCopy.length; i++){
                    if (i === debtsCopy.length){
                        i = 0
                    }
                    if (debtsCopy[i - 1].months_to_paid > debtsCopy[i].months_to_paid){
                        let temp = debtsCopy[i]
                        debtsCopy[i] = debtsCopy[i - 1]
                        debtsCopy[i - 1] = temp
                        changesNeeded = true
                    }
                }
            }
        }
        console.log(debtsCopy)
        setUserDebts(debtsCopy)
    }

    useEffect(() => {
        if (userDebts.length < 1)
        getUserDebts()
    }, [])

    const setDebtEndPoints = async() => {

        console.log("Snowball value being sent: " + snowball['snowball'])

        let copy = [...userDebts]
        let changesNeeded = true
        while (changesNeeded === true){
            console.log(copy[0])
            changesNeeded = false
            for (let i = 1; i < copy.length; i++){
                if (i === copy.length){
                    i = 0
                }
                if (copy[i - 1].months_to_paid > copy[i].months_to_paid){
                    let temp = copy[i]
                    copy[i] = copy[i - 1]
                    copy[i - 1] = temp
                    changesNeeded = true
                }
            }
        }

        let payload = []
        payload.push(snowball)
        copy.forEach(debt => {
            payload.push(debt)
        })
        let service = new DataService()
        let data = await service.snowball(payload)

        console.log(data)

        updateProgressValue(data)

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
        let name = e.target.name
        let val = e.target.value
        val = parseFloat(val)
        setSnowball(val)
        console.log("Value is: " + val)
    }

    const updateProgressValue = (data) => {
        // let element = document.querySelector('.debt-display')
        let elements = document.querySelectorAll('.debt-display')

        for (let i = 0; i < elements.length; i++){
            let newWidth = (data[i].new_end_point / parseInt(userDebts[i].months_to_paid)) * 100
            if (newWidth > 100){
                newWidth = 100
            }
            console.log(newWidth)
            elements[i].style.width =  newWidth + '%'
        }
    }

    const applySnowball = async() => {
        await setDebtEndPoints()
    }

    return (
        <div className="debt-snowball container">
            <div className="input-container">
                <label className="snowball-amount-label">Additional Payment</label>
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
                                <label>Current Balance</label>
                                <label>Payoff</label>
                            </div>
                            <div className="debt-range">
                                <label className="range-lable">{debt.current_principle_balance.toFixed(2)}</label>
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