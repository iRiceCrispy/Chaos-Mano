import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getSessionUser, restoreSession } from './store/session';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Splash from './components/Splash';

const App = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(getSessionUser);
  const [isLoaded, setIsLoaded] = useState(false);
  // document.addEventListener('keydown', (e) => {
  //   if (e.target.nodeName === 'INPUT' && e.key === 'Enter') e.preventDefault();
  // });

  useEffect(() => {
    axios.defaults.headers.common = {
      'Content-Type': 'application/json',
      'XSRF-Token': Cookies.get('XSRF-TOKEN'),
    };

    (async () => {
      await dispatch(restoreSession());
      setIsLoaded(true);
    })();
  }, [dispatch]);

  return isLoaded && (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Splash />}
        />
        <Route
          path="/login"
          element={<Auth type="login" />}
        />
        <Route
          path="/signup"
          element={<Auth type="signup" />}
        />
        <Route
          path="/dashboard/*"
          element={sessionUser ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
