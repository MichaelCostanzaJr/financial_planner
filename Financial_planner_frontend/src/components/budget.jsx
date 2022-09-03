import { useContext, useState } from "react"
import DataContext from "../context/dataContext"
import Row from "../components/row"
import "../components/budget.css"
import AddRowTool from "./addRowTool"


const Budget = () => {

    let budget = useContext(DataContext).activeBudget

    return (
        <div className="budget">
            <div className="container">
                <h2 className="budget-title">{budget.title}</h2>
                
                <AddRowTool type="income"/>
                <h3 className="table-title">Income</h3>
                <div className="income-table">
                    {
                        
                        budget.income.map(item => (
                            <Row type="income" data={item}></Row>
                        ))
                    }
                    <div className="income-total">
                        <div className="income-total-label">Total Income</div>
                        <div className="income income-total-value">{budget.income_total}</div>
                    </div>
                </div>
                <hr className="divider" />
                <AddRowTool type="expense"/>
                <h3 className="table-title">Expenses</h3>
                <div className="expense-table">
                    {
                        budget.expenses.map(item => (
                            <Row type="expense" data={item}></Row>
                        ))
                    }
                    <div className="expense-total">
                        <div className="expense-total-label">Total expense</div>
                        <div className="expense expense-total-value">{budget.expense_total}</div>
                    </div>
                </div>
                <hr className="divider" />
                <div className="surplus-table">
                    <div className="surplus-title">Surplus / Deficit</div>
                    {budget.surplus >= 0 &&
                        <div className="income">{budget.surplus}</div>
                    }
                    {budget.surplus < 0 &&
                        <div className="expense">{budget.surplus}</div>
                    }
                </div>
                <div className="btn-container">
                    <button className="btn">Save Budget</button>
                </div>
            </div>
        </div>
    )
}

export default Budget