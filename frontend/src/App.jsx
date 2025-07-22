import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your components with correct paths
import AdminSignup from './pages/admin/adminsignup.jsx';
import AdminLogin from './pages/admin/adminlogin';
import EventHive from './pages/admin/adminevents.jsx';
import CreateEvent from './pages/admin/createevent.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/EventHive" element={<EventHive />} />
        <Route path="/createevent" element={<CreateEvent />} />

        {/* Add more routes as needed */}
        {/* User Routes can be added similarly */}

      
      </Routes>
    </Router>
  );
}

export default App;
