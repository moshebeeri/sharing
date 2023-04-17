
import React, { useContext } from "react";
import { Button, Col, Row, Container, Form, Navbar } from "react-bootstrap";
import EventsViewer from "./components/EventsViewer";
import ScheduleResource from "./components/ScheduleResource";
import { AuthContext } from "./context/AuthContext";
import Layout from "./Layout";

import { Route, BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router';
import Login from "./components/Login";

// import Home from "./components/Home";
// import Login from "./components/Login";
// import Logout from "./components/Logout";
// import Resource from "./components/Resource";
// import Events from "./components/Events";
// import Scheduler from "./components/Scheduler"

function App_Orig() {
  const user = useContext(AuthContext);

  return (
    <>
      <Layout children={<EventsViewer/>}/>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout children={<EventsViewer />} />} />
        <Route path="/login" element={<Layout children={<Login />} />} />
        {/*
        <Route path="/logout" element={<Layout children={<EventsViewer/>}/>} />
        <Route path="/resource" element={<Layout children={<EventsViewer/>}/>} />
        <Route path="/events" element={<Layout children={<EventsViewer/>}/>} />
        <Route path="/scheduler" element={<Layout children={<EventsViewer/>}/>} /> */}
      </Routes>
    </BrowserRouter>

  );
}



export default App;