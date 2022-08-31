

import {Route,Routes,BrowserRouter as Router} from "react-router-dom";
import './App.css';
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Navbar from "./components/navbar";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
          <Routes>
            <Route path= "/" exact element= {<Login/>}/>
            <Route path= "/register" exact element= {<Register/>}/>
            <Route path= "/home" exact element= {<Home/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
