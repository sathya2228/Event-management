import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your components with correct paths
import AdminSignup from './pages/admin/adminsignup.jsx';
import AdminLogin from './pages/admin/adminlogin';
import CreateEvent from './pages/admin/createevent.jsx';


// You can create similar components like UserLogin, UserRegister, etc., inside `pages/users`


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/create-event" element={<CreateEvent />} />
        {/* <Route path="/events" element={<AdminEvents />} /> */}
        
        {/* Add more routes as needed */}
        {/* User Routes can be added similarly */}

      
      </Routes>
    </Router>
  );
}

export default App;
