import { useContext } from "react"
import DataContext from "../context/dataContext"
import Budget from "../components/budget"
import { useEffect } from "react"
import { useState } from "react"


const NewBudget = () => {

    let activeUser = useContext(DataContext).user
    let setActiveBudget = useContext(DataContext).updateActiveBudget
    let activeBudget = useContext(DataContext).activeBudget
    const [title, setTitle] = useState('')
    

    const newBudget = () => {
        setActiveBudget({
            "title": '',
            "income": [],
            "expenses": [],
            "income_total": 0,
            "expense_total": 0,
            "surplus": 0,
            "owner": activeUser['user_name'],
            "next_index": 0
        })
    }

    useEffect(() => {
        newBudget()
        console.log(activeBudget)
        console.log(activeUser)
    }, [])

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

    return (

        <div className="view-budget">
            {!activeBudget.title &&
            <div className="container">
                <input type="text" onChange={onChange} placeholder="Enter Budget Name"/>
                <div className="btn-container">
                    <button className="btn" onClick={updateTitle}>Apply Budget Name</button>
                </div>
            </div>
            }
            <Budget></Budget>
        </div>
    )
}

export default NewBudget