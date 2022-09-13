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
            obj[element] = values[index]
            copy.push(obj)
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
    }

    return (
        <div className="row">
            {props.type === 'income' &&
            <>
                <button className="edit-btn btn" onClick={updateRow}><i className="far fa-edit"></i></button>
                <div className="row-name budget-data">{props.data.source}</div>
                <div className={props.type}>${props.data.value.toFixed(2)}</div>
                <button className="delete-btn btn" onClick={deleteRow}><i className="fas fa-trash-alt"></i></button>
            </>
            }
            {props.type === 'expense' &&
            <>
                <button className="edit-btn btn" onClick={updateRow}><i className="far fa-edit"></i></button>
                <div className="info-container">
                    <div className="row-name budget-data">{props.data.expenseName} / {props.data.expensePriority}</div>
                    <div className="info" onClick={toggleInfo}>
                        <i className="fa-solid fa-info"></i>
                    </div>
                </div>
                <div className={props.type}>${props.data.expenseValue.toFixed(2)}</div>
                <button className="delete-btn btn" onClick={deleteRow}><i className="fas fa-trash-alt"></i></button>
            </>
            }
            {toggleActive &&
            <>
                <div className="info-box-container" onClick={toggleInfo}>
                    <div className="info-box">
                        {
                            data.map(item => (
                                <p><span className='info-name'>{Object.keys(item)}: </span>{Object.values(item)}</p>
                            ))
                        }
                    </div>
                </div>
            </>
            }
        </div>
    )
}

export default Row