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
import MainPage from "./components/main/MainPage";
import Layout from "./Layout";
import { getAuth } from 'firebase/auth';
import SubscriptionForm from "./app/operations/SubscriptionForm";
import Search from "./components/search/Search";


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userLoading());
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged called " + user);
      if (user) {
        // User is signed in
        dispatch(userLoaded({userId: user.uid, userName: user.displayName, userEmail: user.email}));
      } else {
        // User is signed out
        dispatch(userLoaded(null));
      }
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
        <Route path="/search" element={<Layout children={<Search />} />} />
        <Route path="/buy/:resourceId" element={<Layout children={<SubscriptionForm />} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


