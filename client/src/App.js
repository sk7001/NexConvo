import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import CheckEmailPage from './pages/CheckEmailPage';
import CheckPasswordPage from './pages/CheckPasswordPage';
import MessagePage from './components/MessagePage';
import Home from './pages/Home';
import Auth from './pages/helper/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email" element={<CheckEmailPage />} />
        <Route path="/password" element={<CheckPasswordPage />} />
        <Route path='/user' element={<Auth />}>
          <Route path='messagepage' element={<MessagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
