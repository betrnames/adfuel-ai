import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Branding from './pages/Branding';
import TwitterHeader from './pages/TwitterHeader';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/branding" element={<Branding />} />
        <Route path="/twitter-header" element={<TwitterHeader />} />
      </Routes>
    </Router>
  );
}
