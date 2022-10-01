import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DataContext from "../context/dataContext"
import Row from "../components/row"
import "../components/budget.css"
import AddRowTool from "./addRowTool"
import DataService from "../services/dataService"


const Budget = () => {

    let budget = useContext(DataContext).activeBudget
    let activeUser = useContext(DataContext).user
    let removeRow = useContext(DataContext).deleteRow
    let updateEditRow = useContext(DataContext).editRow
    let startingIndex = parseInt(budget['next_index'])
    const [index, setIndex] = useState(startingIndex)
    const [editIndex, setEditIndex] = useState(0)
    const [edit, setEdit] = useState(false)
    const [editRow, setEditRow] = useState({})
    const [showInfo, setShowInfo] = useState(false)
    const [infoData, setInfoData] = useState([])

    let navigate = useNavigate()

    const loadData = (data) => {
        console.log("data: " + Object.values(data[0]))
        setInfoData(data)
        toggleInfo()
    }

    const saveBudget = async() => {

        let copy = {...budget}
        copy['next_index'] = index
        let service = new DataService()
        let response = await service.postBudget(copy)

        if (response){
            alert("Budget Successfully updated!")
        }else{
            alert("ERROR! Budget save failed.")
        }
    }

    const onChange = (e) => {
        let name = e.target.name
        let val = e.target.value

        setEditRow(prev => ({...prev, [name]:val}))
    }

    const getIndex = () =>{
        let currentIndex = index
        setIndex(index + 1)
        return currentIndex
    }

    const deleteRow = (id) => {
        removeRow(id)
    }

    const updateRow = () => {
        updateEditRow(editIndex, editRow)
        toggleEdit()
    }

    const toggleEdit = (id) => {
        if (edit){
            setEdit(false)
        }else{
            setEdit(true)
        }

        setEditIndex(id)
    }

    const toggleInfo = () => {
        // if (showInfo){
        //     setShowInfo(false)
        // }else{
        //     setShowInfo(true)
        // }

        
    }



    return (
        <div className="budget container">
            {edit &&
                <div className="edit-background">
                    <div className="edit-container ">
                        <h3 className="header">Edit Row</h3>
                        <div className="edit-form form">
                            <input name="name" className="edit-name-input input" type="text" onChange={onChange} placeholder="New Source"/>
                            <input name="value" className="edit-value-input input" type="number" onChange={onChange} step={'0.01'} placeholder="New Value"/>
                        </div>
                        <div className="btn-container">
                            <button className="btn" onClick={updateRow}>Apply</button>
                            <button className="btn" onClick={toggleEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
            {/* {showInfo &&
                <div className="info-box-container" onClick={toggleInfo}>
                    <div className="info-box">
                        {
                            infoData.map((item, index) => (
                                <>
                                    <div key={Object.keys(item) + index} className="expense-info-container">
                                        <p key={Object.keys(item)} className='info-name'>{Object.keys(item)}: </p >
                                        <p key={Object.values(item)} className='info-value'>{Object.values(item)}</p>
                                    </div>
                                    
                                </>
                            ))
                        }
                    </div>
                </div>
            } */}

            <div className="">
                <h2 className="budget-title">{budget.title}</h2>
                
                <AddRowTool getIndex={getIndex} index={index} type="income"/>
                <h4 className="table-title">Income</h4>
                <div className="income-table">
                    {budget.income &&
                        budget.income.map(item => (
                            <Row key={item.index} type="income" updateRow={toggleEdit} deleteRow={deleteRow} id={item.index} data={item}></Row>
                        ))
                    }
                    <div className="income-total">
                        <div className="income-total-label">Total Income</div>
                        <div className="income income-total-value">${budget.income_total.toFixed(2)}</div>
                    </div>
                </div>
                <hr className="divider" />
                <AddRowTool getIndex={getIndex} index={index} type="expense"/>
                <h4 className="table-title">Expenses</h4>
                <div className="expense-table">
                    {budget.expenses &&
                        budget.expenses.map(item => (
                            <Row key={item.index} type="expense" toggleInfo={toggleInfo} updateRow={toggleEdit} deleteRow={deleteRow} id={item.index} data={item}></Row>
                        ))
                    }
                    <div className="expense-total">
                        <div className="expense-total-label">Total expense</div>
                        <div className="expense expense-total-value">${budget.expense_total.toFixed(2)}</div>
                    </div>
                </div>
                <hr className="divider" />
                <div className="surplus-table">
                    <div className="surplus-title">Surplus / Deficit</div>
                    {budget.surplus >= 0 &&
                        <div className="income">${budget.surplus.toFixed(2)}</div>
                    }
                    {budget.surplus < 0 &&
                        <div className="expense">${(budget.surplus * -1).toFixed(2)} </div>
                    }
                </div>
                
                <div className="btn-container save-btn">
                    <button className="btn" onClick={saveBudget}>Save Budget</button>
                </div>
            </div>
        </div>
    )
}

export default Budget