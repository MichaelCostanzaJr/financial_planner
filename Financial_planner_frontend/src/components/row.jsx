import { useState } from 'react'
import '../components/row.css'


const Row = (props) => {

    let id = props.id

    const deleteRow = () => {
        props.deleteRow(id)
    }

    const updateRow = () => {
        props.updateRow(id)
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
                <div className="row-name budget-data">{props.data.expenseName} / {props.data.expensePriority}</div>
                <div className={props.type}>${props.data.expenseValue.toFixed(2)}</div>
                <button className="delete-btn btn" onClick={deleteRow}><i className="fas fa-trash-alt"></i></button>
            </>
            }
        </div>
    )
}

export default Row