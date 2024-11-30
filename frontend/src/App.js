import './App.css';
import React, { useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home"
import Menu from "./pages/Menu"
import NoPage from "./pages/NoPage"
import DrawerMenu from './pages/components/DrawerMenu';
import Navbar from './pages/components/Navbar';

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
          <Route path="/menu" element={<Menu/>}/>
          <Route path="*" element={<NoPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;