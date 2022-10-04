import { useState, useEffect } from 'react'
import '../components/row.css'


const Row = (props) => {

    const [data, setData] = useState([])
    const [toggleActive, setToggleActive] = useState(false)

    const loadData = () => {
        let copy = []
        let keys = Object.keys(props.data)
        let values = Object.values(props.data)

        keys.forEach((element, index)=> {
            let obj = {}
            if (element !== 'index' && element !== 'last_update_date'){
                if(element === 'apr'){
                    obj['Annual Percentage Rate'] = values[index] + '%'
                }if(element === 'expenseName'){
                    obj['Expense Name'] = values[index]
                }if(element === 'expensePriority'){
                    obj['Priority'] = values[index]
                }if(element === 'pay_off_date'){
                    let temp = new Date(values[index])
                    let date = temp.getDay()+ "/" + temp.getMonth() + "/" + temp.getFullYear()
                    obj['Payoff Date'] = date
                }if(element === 'pay_off_value'){
                    obj['Payoff Value'] = '$' + values[index]
                }if(element === 'start_date'){
                    let temp = new Date(values[index])
                    let date = temp.getDay()+ "/" + temp.getMonth() + "/" + temp.getFullYear()
                    obj['Loan Start Date'] = date
                }if(element === 'term'){
                    obj['Length of Loan'] = values[index] + ' months'
                }if(element === 'expenseValue'){
                    obj['Monthly Amount'] = '$' + values[index].toFixed(2)
                }
                copy.push(obj)
            }
        })
        
        setData(copy)
    }

    useEffect(() => {
        loadData()
    }, [])

    let id = props.id

    const deleteRow = () => {
        props.deleteRow(id)
    }

    const updateRow = () => {
        props.updateRow(id)
    }

    const toggleInfo = () => {
        if (toggleActive){
            setToggleActive(false)
        }else{
            setToggleActive(true)
        }
        // props.toggleInfo(id)
    }

    return (
        <div className="row">
            {props.type === 'income' &&
            <>
                <button className="edit-btn row-btn" onClick={updateRow}><i className="far fa-edit"></i></button>
                <div className="row-name budget-data">{props.data.source}</div>
                <div className={props.type}>${props.data.value.toFixed(2)}</div>
                <button className="delete-btn row-btn" onClick={deleteRow}><i className="fas fa-trash-alt"></i></button>
            </>
            }
            {props.type === 'expense' &&
            <>
                <button className="edit-btn row-btn" onClick={updateRow}><i className="far fa-edit"></i></button>
                <div className="info-container">
                    <div className="row-name budget-data">{props.data.expenseName}</div>
                    <div className="info" onClick={toggleInfo}>
                        <i className="fa-solid fa-info"></i>
                    </div>
                </div>
                <div className={props.type}>${props.data.expenseValue.toFixed(2)}</div>
                <button className="delete-btn row-btn" onClick={deleteRow}><i className="fas fa-trash-alt"></i></button>
            </>
            }
            {toggleActive &&
                <div className="info-box-container" onClick={toggleInfo}>
                    <div className="info-box">
                        <div key={props.data.index + props.data.expenseName} className="expense-info-container">
                            <p key={props.data.index + props.data.expenseName + props.data.index} className='info-name'>Expense: </p >
                            <p key={props.data.expenseValue + props.data.index} className='info-value'>{props.data.expenseName}</p>
                        </div>
                        <div key={props.data.index + props.data.expenseValue} className="expense-info-container">
                            <p key={props.data.index + props.data.expenseValue + props.data.index} className='info-name'>Value: </p >
                            <p key={props.data.expenseValue + props.data.index} className='info-value'>{props.data.expenseValue}</p>
                        </div>
                        <div key={props.data.index + props.data.expensePriority} className="expense-info-container">
                            <p key={props.data.index + props.data.expensePriority + props.data.index} className='info-name'>Priority: </p >
                            <p key={props.data.expensePriority + props.data.index} className='info-value'>{props.data.expensePriority}</p>
                        </div>
                        {props.data.apr &&
                        <>
                            <div key={props.data.index + props.data.term} className="expense-info-container">
                                <p key={props.data.index + props.data.term + props.data.index} className='info-name'>Term: </p >
                                <p key={props.data.term + props.data.index} className='info-value'>{props.data.term}</p>
                            </div>
                            <div key={props.data.index + props.data.apr} className="expense-info-container">
                                <p key={props.data.index + props.data.apr + props.data.index} className='info-name'>Apr: </p >
                                <p key={props.data.apr + props.data.index} className='info-value'>{props.data.apr}</p>
                            </div>
                            <div key={props.data.index + props.data.total_principle_paid} className="expense-info-container">
                                <p key={props.data.index + props.data.total_principle_paid + props.data.index} className='info-name'>Total Principle Paid: </p >
                                <p key={props.data.total_principle_paid + props.data.index} className='info-value'>{props.data.total_principle_paid}</p>
                            </div>
                            <div key={props.data.index + props.data.loan_start_date} className="expense-info-container">
                                <p key={props.data.index + props.data.loan_start_date + props.data.index} className='info-name'>Loan Start Date: </p >
                                <p key={props.data.loan_start_date + props.data.index} className='info-value'>{props.data.loan_start_date}</p>
                            </div>
                            <div key={props.data.index + props.loan_amount} className="expense-info-container">
                                <p key={props.data.index + props.data.loan_amount + props.data.index} className='info-name'>Original Loan Amount: </p >
                                <p key={props.data.loan_amount + props.data.index} className='info-value'>{props.data.loan_amount}</p>
                            </div>
                            <div key={props.data.index + props.current_principle_balance} className="expense-info-container">
                                <p key={props.data.index + props.data.current_principle_balance + props.data.index} className='info-name'>Current Principle Balance: </p >
                                <p key={props.data.current_principle_balance + props.data.index} className='info-value'>{props.data.current_principle_balance}</p>
                            </div>
                        </>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Row