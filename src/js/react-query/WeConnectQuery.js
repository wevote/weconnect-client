// eslint-disable-next-line no-unused-vars
import React from 'react';
import axios from 'axios';
import webAppConfig from '../config';

// https://refine.dev/blog/react-query-guide/#performing-basic-data-fetching
// Define a default query function that will receive the query key
const weConnectQueryFn = async (queryKey, params) => {
  const url = new URL(`${queryKey}/`, webAppConfig.STAFF_API_SERVER_API_ROOT_URL);
  url.search = new URLSearchParams(params);
  console.log('weConnectQueryFn url.href: ', url.href);

  const response = await axios.get(url.href);
  // console.log('weConnectQueryFn  response.data: ', JSON.stringify(response.data));

  return response.data;
};

export default weConnectQueryFn;
