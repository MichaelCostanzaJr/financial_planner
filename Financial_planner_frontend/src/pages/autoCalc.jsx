import { useNavigate } from "react-router-dom"
import "../components/autoCalc.css"

const AutoCalculator = () => {

    let navigate = useNavigate()

    return (
        <div className="auto-calulator">
            <h1 className="header">Auto Calculator</h1>
            <h3 className="note">Optional fields use national average if no value is provided.</h3>
            <div className="container">
                <div className="form">
                    <input type="text" placeholder="Enter Car Price" className="price" />
                <select className="dropdown" name="term" id="term">
                <option value="" >Term</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
                <option value="72">72 Months</option>
                </select>
                <input type="number" step={'0.01'} placeholder="APR %"/>
                <input type="number" step={'0.01'} placeholder="Insurance Cost (Optional)"/>
                <input type="number" step={'0.01'} placeholder="Trade In Value"/>
                <input type="number" step={'0.01'} placeholder="Down Payment"/>
                </div>
                <div className="btn-container">
                <button className="btn">Calculate</button>
                </div>
            </div>
        </div>
    )
}










export default AutoCalculator