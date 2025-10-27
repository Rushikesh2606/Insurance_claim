import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import NotFound from './pages/NotFound';
import Dashboard  from "./components/Dashboard";
import Manager_DashBoard from "./pages/ManagerModules"
import New_claim from "./pages/NewClaim"
import ClaimDetails from "./pages/ClaimDetails";
import EditClaim from './pages/EditClaim';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
          <Route path="/signup" element={<Signup />} />

        <Route path="/NotFound" element={<NotFound />} />
           <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/manager_dashboard" element={<Manager_DashBoard />} />
           <Route path="/add_claim" element={<New_claim/>} />
          <Route path="/claims/:id" element={<ClaimDetails />} />
          <Route path="/claims/:id/edit" element={<EditClaim />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;