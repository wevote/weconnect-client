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

