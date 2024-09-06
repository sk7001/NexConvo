import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import MessagePage from './components/MessagePage';
import Home from './pages/Home';
import Auth from './pages/helper/Auth';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Auth />}>
          <Route path='/user' element={<MessagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
