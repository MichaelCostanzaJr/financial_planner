

import {Route,Routes,BrowserRouter as Router} from "react-router-dom";
import './App.css';
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import RecoverUsername from "./pages/forgotUsername";
import RecoverPassword from "./pages/recoverPassword";
import RecoverSuccess from "./pages/recoverSuccess";
import RecoverPasswordReset from "./pages/recoverPasswordReset";
import RecoverPasswordResetSuccess from "./pages/recoveryPasswordResetSuccess";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
          <Routes>
            <Route path= "/" exact element= {<Login/>}/>
            <Route path= "/register" exact element= {<Register/>}/>
            <Route path= "/home" exact element= {<Home/>}/>
            <Route path= "/recovery/username" exact element= {<RecoverUsername/>}/>
            <Route path= "/recovery/password" exact element= {<RecoverPassword/>}/>
            <Route path= "/recovery/success" exact element= {<RecoverSuccess/>}/>
            <Route path= "/recovery/reset-password" exact element= {<RecoverPasswordReset/>}/>
            <Route path= "/recovery/reset-password-success" exact element= {<RecoverPasswordResetSuccess/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
