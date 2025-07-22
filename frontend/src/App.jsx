import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your components with correct paths
import AdminSignup from './pages/admin/adminsignup.jsx';
import AdminLogin from './pages/admin/adminlogin';
import CreateEvent from './pages/admin/createevent.jsx';
import AdminEvents from './pages/admin/events.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/" element={<AdminLogin />} />
    
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/events" element={<AdminEvents />} />

        {/* Add more routes as needed */}
        {/* User Routes can be added similarly */}

      
      </Routes>
    </Router>
  );
}

export default App;
