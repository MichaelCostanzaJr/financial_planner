import { useContext, useState } from "react"
import DataContext from "../context/dataContext"
import Row from "../components/row"
import "../components/budget.css"
import AddRowTool from "./addRowTool"
import DataService from "../services/dataService"


const Budget = () => {

    let budget = useContext(DataContext).activeBudget
    let removeRow = useContext(DataContext).deleteRow
    let startingIndex = parseInt(budget['next_index'])
    const [index, setIndex] = useState(startingIndex)

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

    const getIndex = () =>{
        let currentIndex = index
        setIndex(index + 1)
        return currentIndex
    }

    const deleteRow = (id) => {
        removeRow(id)
    }

    return (
        <div className="budget">
            <div className="container">
                <h2 className="budget-title">{budget.title}</h2>
                
                <AddRowTool getIndex={getIndex} index={index} type="income"/>
                <h3 className="table-title">Income</h3>
                <div className="income-table">
                    {budget.income &&
                        budget.income.map(item => (
                            <Row key={item.index} type="income" deleteRow={deleteRow} id={item.index} data={item}></Row>
                        ))
                    }
                    <div className="income-total">
                        <div className="income-total-label">Total Income</div>
                        <div className="income income-total-value">${budget.income_total}</div>
                    </div>
                </div>
                <hr className="divider" />
                <AddRowTool getIndex={getIndex} index={index} type="expense"/>
                <h3 className="table-title">Expenses</h3>
                <div className="expense-table">
                    {budget.expenses &&
                        budget.expenses.map(item => (
                            <Row key={item.index} type="expense" deleteRow={deleteRow} id={item.index} data={item}></Row>
                        ))
                    }
                    <div className="expense-total">
                        <div className="expense-total-label">Total expense</div>
                        <div className="expense expense-total-value">${budget.expense_total}</div>
                    </div>
                </div>
                <hr className="divider" />
                <div className="surplus-table">
                    <div className="surplus-title">Surplus / Deficit</div>
                    {budget.surplus >= 0 &&
                        <div className="income">${budget.surplus}</div>
                    }
                    {budget.surplus < 0 &&
                        <div className="expense">${budget.surplus}</div>
                    }
                </div>
                <div className="btn-container">
                    <button className="btn" onClick={saveBudget}>Save Budget</button>
                </div>
            </div>
        </div>
    )
}

export default Budget