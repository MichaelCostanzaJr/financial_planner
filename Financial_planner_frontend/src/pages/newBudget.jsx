import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import DataContext from "../context/dataContext"
import Budget from "../components/budget"
import { useState } from "react"


const NewBudget = () => {

    let setActiveBudget = useContext(DataContext).updateActiveBudget
    let activeBudget = useContext(DataContext).activeBudget
    const [title, setTitle] = useState('')
    
    let navigate = useNavigate()

    const onChange = (e) => {
        let val = e.target.value
        setTitle(val)
    }

    const updateTitle = () => {
        let copy = {...activeBudget}
        copy['title'] = title
        setActiveBudget(copy)
        console.log(copy)
    }

    const cancel = () => {
        let path = "/budget/home"
        navigate(path)
    }

    return (

        <div className="view-budget">
            {!activeBudget.title &&
            <>
                <div className="container form">
                    <input type="text" onChange={onChange} placeholder="Enter Budget Name"/>
                </div>
                <div className="container btn-container">
                    <button className="btn" onClick={updateTitle}>Apply Budget Name</button>
                </div>
            </>
            }
            
            <Budget></Budget>
            <div className=" container btn-container">
                <button className="btn" onClick={cancel}>Cancel</button>
            </div>
        </div>
    )
}

export default NewBudget