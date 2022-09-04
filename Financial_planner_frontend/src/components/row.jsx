import { useState } from 'react'
import '../components/row.css'


const Row = (props) => {

    let id = props.id

    const deleteRow = () => {
        props.deleteRow(id)
    }

    return (
        <div className="row">
            {props.type === 'income' &&
            <>
                <button className="edit-btn btn">Edit</button>
                <div className="row-name budget-data">{props.data.source}</div>
                <div className={props.type}>{props.data.value}</div>
                <button className="delete-btn btn" onClick={deleteRow}>Delete</button>
            </>
            }
            {props.type === 'expense' &&
            <>
                <button className="edit-btn btn">Edit</button>
                <div className="row-name budget-data">{props.data.expenseName} / {props.data.expensePriority}</div>
                <div className={props.type}>{props.data.expenseValue}</div>
                <button className="delete-btn btn" onClick={deleteRow}>Delete</button>
            </>
            }
        </div>
    )
}

export default Row