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

    async recoverUsername(email){
        console.log("Attempting to send recovery email..")
        let data
        await axios.post("http://127.0.0.1:5000/api/recover-username", email).then(res =>{
            console.log(res.data)
            data = res.data
        })
        return data
    }

    async recoverPassword(user){
        console.log("Attempting to recover password..")
        let data
        await axios.post('http://127.0.0.1:5000/api/recover-password', user).then(res =>{
            console.log(res.data)
            data = res.data
        })
        return data
    }

    async resetPassword(passwordData){
        console.log("Attempting to reset password...")
        let data
        await axios.post('http://127.0.0.1:5000/api/reset-password', passwordData).then(res =>{
            console.log(res.data)
            data = res.data
        })

        return data
    }

    // will need to change this in the backend to get only budgtes belonging to the logged in user
    async getBudgets(id){
        let response = await axios.get('http://127.0.0.1:5000/api/budgets/' + id)
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