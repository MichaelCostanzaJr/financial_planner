import axios from "axios"

class DataService{

    async postUser(user){
        console.log("Attempting to post user")

        await axios.post("http://127.0.0.1:5000/register", user).then(res =>{
            console.log(res.data)
        })
    }

    async login(cradentials){
        console.log("Attempting to get user")
        let newdata = {}

        let response = await axios.post("http://127.0.0.1:5000/user/" + cradentials['user_name'], cradentials).then(res =>{
            console.log(res.data)
            newdata = res.data
        })
        // let data = response.data[0]
        return newdata
    }

    async getBudgets(){
        let response = await axios.get('http://127.0.0.1:5000/api/budgets')
        let data = response.data
        console.log(data)

        return data
    }

    async postBudget(budget){
        console.log("Attempting to post budget...")

        await axios.post("http://127.0.0.1:5000/api/budgets", budget).then(res =>{
            console.log(res.data)
        })
    }
}

export default DataService