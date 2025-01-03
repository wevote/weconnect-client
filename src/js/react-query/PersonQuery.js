// import React from 'react';
// import ReactDOM from 'react-dom/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import webAppConfig from '../config';

// https://refine.dev/blog/react-query-guide/#performing-basic-data-fetching
// Define a default query function that will receive the query key
export const personQueryFn = async (queryKey, params) => {
  const url = new URL(`${queryKey}/`, webAppConfig.STAFF_API_SERVER_API_ROOT_URL);
  url.search = new URLSearchParams(params);
  console.log(url.href);

  const response = await axios.get(url.href);

  return response.data;
};


export const personListRetrieve = (data, teamId) => {
  const personListRaw = data.personList;

  const personList = [];
  let personFiltered;
  let personRaw;
  for (let i = 0; i < personListRaw.length; i++) {
    console.log('teamId: ', teamId);
    personRaw = personListRaw[i];
    personFiltered = personRaw;
    personList.push(personFiltered);
  }
  return personList;
};

export const getFullNamePreferred = (personMember) => {
  let fullName = '';
  if (personMember.id >= 0) {
    if (personMember.firstNamePreferred) {
      fullName += personMember.firstNamePreferred;
    } else if (personMember.firstName) {
      fullName += personMember.firstName;
    }
    if (fullName.length > 0 && personMember.lastName) {
      fullName += ' ';
    }
    if (personMember.lastName) {
      fullName += personMember.lastName;
    }
  }
  return fullName;
};
