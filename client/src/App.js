import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { useState } from 'react';
import Navbar from './components/Navbar'
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navbar />} >
        <Route element={<Alert alert={alert} />} >
          <Route index element={<Home showAlert={showAlert} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<Signup showAlert={showAlert} />} />
        </Route>
      </Route>
    )
  )

  return (
    <>
      <NoteState>
        <RouterProvider router={router} />
      </NoteState>
    </>
  );
}

export default App;