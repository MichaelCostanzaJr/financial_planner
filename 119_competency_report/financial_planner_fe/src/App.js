

import {Route,Routes,BrowserRouter as Router} from "react-router-dom";
import './App.css';
import GlobalDataProvider from "./context/globalDataProvider";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import RecoverUsername from "./pages/forgotUsername";
import RecoverPassword from "./pages/recoverPassword";
import RecoverSuccess from "./pages/recoverSuccess";
import RecoverPasswordReset from "./pages/recoverPasswordReset";
import RecoverPasswordResetSuccess from "./pages/recoveryPasswordResetSuccess";
import MortgageCalculator from "./pages/mortgageCalc";
import BudgetHome from "./pages/budgetHome";
import ViewBudget from "./pages/viewBudget";
import NewBudget from "./pages/newBudget"
import AutoCalculator from "./pages/autoCalc";
import BudgetOptimizer from "./pages/budgetOptimizer";
import FinancialGoals from "./pages/financialGoals";
import DebtSnowball from "./pages/debtSnowball";

// add logic to get token when user logs in.  If no toke, prevent access to some pages and redirect to home if user attempts to access unauthorized pages

function App() {
  return (
    <div className="App">
      <GlobalDataProvider>
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
              <Route path= "/mortgage-calculator" exact element= {<MortgageCalculator/>}/>
              <Route path= "/auto-calculator" exact element= {<AutoCalculator/>}/>
              <Route path= "/budget/home" exact element= {<BudgetHome/>}/>
              <Route path= "/view-budget" exact element= {<ViewBudget/>}/>
              <Route path= "/new-budget" exact element= {<NewBudget/>}/>
              <Route path= "/budget-optimizer" exact element= {<BudgetOptimizer/>}/>
              <Route path= "/financial-goals" exact element= {<FinancialGoals/>}/>
              <Route path= "/debt-snowball" exact element= {<DebtSnowball/>}/>
            </Routes>
        </Router>
      </GlobalDataProvider>
    </div>
  );
}

export default App;
