import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import AddPersonForm from './AddPersonForm';


// eslint-disable-next-line no-unused-vars
const AddPersonDrawerMainContent = () => {
  renderLog('AddPersonDrawerMainContent');
  const { getAppContextValue } = useConnectAppContext();

  const params  = useParams();
  console.log('AddPersonDrawerMainContent params: ', params);
  const queryClient = useQueryClient();

  const [staffToDisplayList, setStaffToDisplayList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchText, setSearchText] = useState('');
  const [allStaffList, setAllStaffList] = useState(getAppContextValue('allStaffList'));
  const [thisTeamsCurrentMembersList, setThisTeamsCurrentMembersList] = useState([]);
  const [teamId, setTeamId] = useState(getAppContextValue('teamId'));
  const [teamName, setTeamName] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [teamMemberPersonIdList, setTeamMemberPersonIdList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchResultsList, setSearchResultsList] = useState([]);

  let memberList = [];
  const teamListFromContext = getAppContextValue('teamListNested');
  if (teamListFromContext  && thisTeamsCurrentMembersList.length === 0 && teamName === '') {
    const oneTeam = teamListFromContext.find((team) => team.id === parseInt(teamId));
    setTeamName(oneTeam.teamName);
    setTeamId(oneTeam.id);

    if (oneTeam && oneTeam.teamMemberList.length > 0) {
      memberList = oneTeam.teamMemberList;
      setThisTeamsCurrentMembersList(memberList);
    }
  } else {
    // console.log('no teamListFromContext yet!');
  }

  if (staffToDisplayList.length === 0 && allStaffList && allStaffList.length > 0) {
    const staffToDisplay = [];
    allStaffList.forEach((oneStaff) => {
      const isOnTeam = memberList.some((obj) => obj.id === oneStaff.id);
      if (!isOnTeam) {
        staffToDisplay.push(oneStaff);
      }
    });
    setStaffToDisplayList(staffToDisplay);
  }

  const addPersonToTeamMutation = useMutation({
    mutationFn: (person) => weConnectQueryFn('add-person-to-team', {
      personId: person.id,
      teamId,
      teamMemberFirstName: person.firstName,
      teamMemberLastName: person.lastName,
      teamName,
    }),
  });

  // TODO: 1/6/25: revive search
  // const searchFunction = (incomingSearchText) => {
  // let searchingJustStarted = false;
  // if (searchText.length === 0 && incomingSearchText.length > 0) {
  //   searchingJustStarted = true;
  // }
  // const isSearching = (incomingSearchText && incomingSearchText.length > 0);
  //   const teamIdTemp = getAppContextValue('addPersonDrawerTeamId');
  //   if (apiCalming(`addPersonToTeamSearch-${teamIdTemp}-${incomingSearchText}`, 60000)) { // Only once per 60 seconds
  //     PersonActions.personListRetrieve(incomingSearchText);
  //   }
  //   setSearchText(incomingSearchText);
  // };

  const clearFunction = () => {
    setAllStaffList([]);
    setSearchText('');
  };

  const addClicked = (person) => {
    addPersonToTeamMutation.mutate(person);
    if (addPersonToTeamMutation.isSuccess) {
      queryClient.invalidateQueries('team-list-retrieve').then(() => {
        // This removes the recently "added" staff, from the list of staff who can be added, the staffToDisplayList
        const updatedStaffToDisplayList = staffToDisplayList.filter((staff) => staff.id !== person.id);
        setStaffToDisplayList(updatedStaffToDisplayList);
      });
    }
  };

  return (
    <AddPersonDrawerMainContentWrapper>
      <SearchBarWrapper>
        <SearchBar2024
          placeholder="Search by name"
          // searchFunction={searchFunction}
          searchFunction={() => console.log('searchFunction')}
          clearFunction={clearFunction}
          searchUpdateDelayTime={750}
        />
      </SearchBarWrapper>
      {(searchResultsList && searchResultsList.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonListTitle>Search Results:</PersonListTitle>
          <PersonList>
            {searchResultsList.map((person) => (
              <PersonItem key={`personResult-${person.id}`}>
                {person.firstName}
                {' '}
                {person.lastName}
                {!arrayContains(person.id, teamMemberPersonIdList) && (
                  <>
                    {' '}
                    <SpanWithLinkStyle onClick={() => addClicked(person)}>add</SpanWithLinkStyle>
                  </>
                )}
              </PersonItem>
            ))}
          </PersonList>
        </PersonSearchResultsWrapper>
      )}
      <PersonDirectoryWrapper>
        <PersonListTitle>All Staff:</PersonListTitle>
        <PersonList>
          {staffToDisplayList.map((person) => (
            <PersonItem key={`personResult-${person.id}`}>
              {person.firstName}
              {' '}
              {person.lastName}
              {!arrayContains(person.id, teamMemberPersonIdList) && (
                <>
                  {' '}
                  <SpanWithLinkStyle onClick={() => addClicked(person)}>add</SpanWithLinkStyle>
                </>
              )}
            </PersonItem>
          ))}
        </PersonList>
      </PersonDirectoryWrapper>
      <AddPersonWrapper>
        <AddPersonForm />
      </AddPersonWrapper>
    </AddPersonDrawerMainContentWrapper>
  );
};

const AddPersonDrawerMainContentWrapper = styled('div')`
`;

const AddPersonWrapper = styled('div')`
  margin-top: 32px;
`;

const PersonDirectoryWrapper = styled('div')`
  margin-top: 16px;
`;

const PersonItem = styled('div')`
`;

const PersonList = styled('div')`
`;

const PersonListTitle = styled('div')`
`;

const PersonSearchResultsWrapper = styled('div')`
  margin-top: 16px;
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default AddPersonDrawerMainContent;
