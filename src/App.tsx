import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';

//Pages
import { Main } from "./Pages/Main";
import { Login } from "./Pages/Login";
import { CreatePostPage } from "./Pages/CreatePost";
import { UserSettings } from "./Pages/UserSettings";

//Components
import { Navbar } from "./Components/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createpost" element={<CreatePostPage />} />
          <Route path="/usersettings" element={<UserSettings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
