import React from 'react';
import { Redirect, Route } from 'react-router-dom';
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

/* eslint-disable react/jsx-props-no-spreading */
// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (isAuthenticated ? (
      <Component {...props} />
    ) : (
      // eslint-disable-next-line react/prop-types
      <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    ))}
  />
);


