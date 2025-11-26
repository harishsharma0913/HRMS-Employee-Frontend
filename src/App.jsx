import './App.css'
import Layout from './Componenet/Layout'
import Payroll from './EmployeePages/Payroll'
import Profile from './EmployeePages/Profile'
import TimeOff from './EmployeePages/TimeOff'
import Performance from './EmployeePages/Performance'
import Home from './Home'
import Login from './Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Learning from './EmployeePages/Learning'
import Document from './EmployeePages/Document'
import Setting from './EmployeePages/Setting'
import PrivateRoute from './Componenet/PrivateRoute'

function App() {
  return (
   <BrowserRouter>
     <Routes>
        <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute><Layout /></PrivateRoute>} >
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/time-off" element={<TimeOff />} />
            <Route path="/help" element={<Payroll />} />
            {/* <Route path="/performance" element={<Performance />} /> */}
            {/* <Route path="/learning" element={<Learning />} /> */}
            <Route path="/documents" element={<Document />} />
            <Route path="/settings" element={<Setting />} />
          </Route>
     </Routes>
    </BrowserRouter>
  )
}

export default App
