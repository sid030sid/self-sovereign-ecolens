import './App.css';
import React, { useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home"
import NoPage from "./pages/NoPage"
import DrawerMenu from './pages/components/DrawerMenu';
import Navbar from './pages/components/Navbar';
import IssuanceForm from './pages/IssuanceForm';

function App() {

  // state variables
  const [openDrawerMenu, setOpenDrawerMenu] = useState(false)

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar handleDrawerMenu={()=>setOpenDrawerMenu(true)}></Navbar>
        <DrawerMenu 
          open={openDrawerMenu} 
          closeDrawerMenu={()=>setOpenDrawerMenu(false)} 
        />
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/issue" element={<IssuanceForm/>}/>
          <Route path="*" element={<NoPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;