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
                    obj['Payoff Value'] = '$' + values[index].toFixed(2)
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
                        {
                            data.map((item, index) => (
                                <div key={Object.keys(item) + index} className="expense-info-container">
                                    <p key={Object.keys(item)} className='info-name'>{Object.keys(item)}: </p >
                                    <p key={Object.values(item)} className='info-value'>{Object.values(item)}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Row