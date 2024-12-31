import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import webAppConfig from './config';


/* global $  */

// eslint-disable-next-line import/prefer-default-export
export async function getAuthentication () {
  if (window.$) {
    console.log(`${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}getAuth`);
    $.get(`${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}auth/`,
      {},
      (data, status) => {
        console.log(`/auth response -- status: '${status}',  data: ${JSON.stringify(data)}`);
        localStorage.setItem('isAuthenticated', data.userId);
        return data.authenticated;
      });
  } else {
    console.log('jquery not yet defined in getAuthentication');
  }
}

// Routes in App.jsx wrapped with PrivateRoute require authentication to access
export const PrivateRoute = () => {
  console.log('========= PrivateRoute =========== isAuth: ', localStorage.getItem('isAuthenticated'));
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
