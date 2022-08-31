import "../components/home.css"


const Home = () => {
    return (
        <div className="home">
            <div className="container">
                <button className="tile budget-btn">Budget</button>
                <button className="tile alt-tile">Debt Snowball</button>
                <button className="tile alt-tile">Budget Optimization</button>
                <button className="tile ">Mortgage Calculator</button>
                <button className="tile ">Auto Finance Calculator</button>
            </div>
        </div>
    )
}

export default Home