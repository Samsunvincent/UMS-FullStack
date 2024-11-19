import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from "./Components/Pages/Login/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Components/Pages/Login/Login.css"
import React from "react";
import AddUser from "./Components/Pages/AddUser/AddUser";
import "./Components/Pages/AddUser/AddUser.css"
import AdminComponent from "./Components/Pages/Admin/adminComponent"
import "./Components/Pages/Admin/adminComponent.css"
import EmployeeComponent from "./Components/Pages/Employee/EmployeeComponent"
import "./Components/Pages/Employee/EmployeeComponent.css"
import ForgotPasswordComponent from "./Components/Pages/ForgotPassword/ForgotPasswordComponent"
import "./Components/Pages/ForgotPassword/ForgotPasswordComponent.css"
// import ProfileComponent from "./Components/Pages/Profile/ProfileComponent"
// import "./Components/Pages/Profile/ProfileComponent.css"
import ResetPassword from './Components/Pages/ResetPassword/ResetPassword';
import "./Components/Pages/ResetPassword/ResetPassword.css"
import ViewUser from './Components/Pages/ViewUser/ViewUser';
import "./Components/Pages/ViewUser/ViewUser.css"
import UpdateUser from './Components/Pages/UpdateUser/UpdateUser';
import "./Components/Pages/UpdateUser/UpdateUser.css"
import EmailVerify from './Components/Pages/VerifyEmail/EmailVerify';
import "./Components/Pages/VerifyEmail/EmailVerify.css"
import LoginReset from './Components/Pages/LoginnedReset/LoginReset';
import "./Components/Pages/LoginnedReset/LoginReset.css"




function App() {


  return (
    <>
  <Router>
    <Routes>
    <Route path='/' exact element={<Login/>}/>
    <Route path='/EmployeeComponent' exact element={<EmployeeComponent/>}/>
    <Route path='/adminComponent' exact element={<AdminComponent/>}/>
    <Route path='/resetPassword' exact element={<ResetPassword/>}/>
    <Route path='/AddUser' exact element={<AddUser/>}/>
    <Route path='/ViewUser' exact element={<ViewUser/>}/>
    <Route path='/UpdateUser' exact element={<UpdateUser/>}/>
    <Route path='/EmailVerify' exact element={<EmailVerify/>}/>
    <Route path="/reset-password" element={<ForgotPasswordComponent />} />
    <Route path="/LoginReset" element={<LoginReset/>}/>

    </Routes>
  </Router>

      {/* <AddUser/> */}
      {/* <AdminComponent/> */}
      {/* <EmployeeComponent/> */}
      {/* <ForgotPasswordComponent/> */}
      {/* <ProfileComponent/> */}
      {/* <ViewUser/> */}
    </>
  )
}

export default App
