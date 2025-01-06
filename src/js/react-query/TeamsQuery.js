// eslint-disable-next-line no-unused-vars
import React from 'react';
import axios from 'axios';
import webAppConfig from '../config';

// https://refine.dev/blog/react-query-guide/#performing-basic-data-fetching
// Define a default query function that will receive the query key
export const teamsQueryFn = async (queryKey, params) => {
  const url = new URL(`${queryKey}/`, webAppConfig.STAFF_API_SERVER_API_ROOT_URL);
  url.search = new URLSearchParams(params);
  console.log('teamsQueryFn url.href: ', url.href);

  const response = await axios.get(url.href);
  // console.log('teamsQueryFn  response.data: ', JSON.stringify(response.data));

  return response.data;
};

export const getTeamList = (teamListData) => {
  const teamListRaw = teamListData.teamList;

  const teamList = [];
  let teamFiltered;
  let teamRaw;
  for (let i = 0; i < teamListRaw.length; i++) {
    teamRaw = teamListRaw[i];
    teamFiltered = teamRaw;
    teamList.push(teamFiltered);
  }
  return teamList;
};

export const getTeamPersonsList = (teamListData, teamId) => {
  console.log('TeamsQuery, getTeamPersonsList teamId:', teamId);
  const { teamMemberList } = teamListData;
  return teamMemberList;

  // const teamList = [];
  // let teamFiltered;
  // let teamRaw;
  // for (let i = 0; i < teamListRaw.length; i++) {
  //   teamRaw = teamListRaw[i];
  //   teamFiltered = teamRaw;
  //   teamList.push(teamFiltered);
  // }
  // return teamList;
};

export const teamRetrieve = (dataTeamPersons, teamId) => {
  console.log('TeamsQuery, teamRetrieve teamId:', teamId);
  return dataTeamPersons;
};



export const addPersonToTeam = (personId, teamId) => {
  console.log(personId + teamId);
  // console.log('TeamActions, addPersonToTeam personId:', personId, ', teamId:', teamId);
  // const teamMemberFirstName = PersonStore.getFirstName(personId) || '';
  // const teamMemberLastName = PersonStore.getLastName(personId) || '';
  // const teamName = TeamStore.getTeamName(teamId) || '';
  // const data = {
  //   personId,
  //   teamId,
  //   teamMemberFirstName,
  //   teamMemberLastName,
  //   teamName,
  // };
  // Dispatcher.loadEndpoint('add-person-to-team', data);
};

