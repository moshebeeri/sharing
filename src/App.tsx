import { useDispatch } from "react-redux";
import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { userLoading, userLoaded } from './features/auth/authSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {EventsViewer} from "./components/EventsViewer";

import Login from "./components/Login";
import ScheduleView from "./components/ScheduleView";
import ResourcesView from "./components/resource/ResourcesView";
import ResourceView from "./components/resource/ResourceView";
import SearchResults from "./components/search/SearchResults";
import MainPage from "./components/main/MainPage";
import Layout from "./Layout";
import { getAuth } from 'firebase/auth';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userLoading());
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(userLoaded(user));
    });

    return () => unsubscribe();
  }, [dispatch]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout children={<MainPage />} />} />
        <Route path="/login" element={<Layout children={<Login />} />} />
        <Route path="/schedule" element={<Layout children={<ScheduleView />} />} />
        <Route path="/activities" element={<Layout children={<EventsViewer />} />} />
        <Route path="/resources" element={<Layout children={<ResourcesView />} />} />
        <Route path="/resource-view/:resourceId" element={<Layout children={<ResourceView />} />} />
        <Route path="/search" element={<Layout children={<SearchResults />} />} />
        <Route path="/checkout" element={<Layout children={<SearchResults />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


