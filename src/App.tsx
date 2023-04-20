
import React from "react";
import {EventsViewer} from "./components/EventsViewer";
import Layout from "./Layout";

import { Route, BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router';
import Login from "./components/Login";
import ScheduleView from "./components/ScheduleView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout children={<EventsViewer />} />} />
        <Route path="/login" element={<Layout children={<Login />} />} />
        <Route path="/schedule" element={<Layout children={<ScheduleView />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;