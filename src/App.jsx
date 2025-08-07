
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerDetails from './pages/CustomerDetails';
import InvoicePage from './pages/Invoice';




function App() {
   return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />


        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );


  
}

export default App
