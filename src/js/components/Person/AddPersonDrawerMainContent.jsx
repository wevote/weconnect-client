import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { withStyles } from '@mui/styles';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import AddPersonForm from './AddPersonForm';
import weConnectQueryFn from '../../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const AddPersonDrawerMainContent = ({ classes }) => {
  renderLog('AddPersonDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  const params  = useParams();
  // eslint-disable-next-line no-unused-vars
  const [allCachedPeopleList, setAllCachedPeopleList] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchText, setSearchText] = React.useState('');
  const [allStaffList, setAllStaffList] = React.useState([]);
  const [teamId, setTeamId] = React.useState(params.teamId);
  const [teamName, setTeamName] = React.useState();
  // eslint-disable-next-line no-unused-vars
  const [teamMemberPersonIdList, setTeamMemberPersonIdList] = React.useState([]);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes
  const [allStaffListLoaded, setAllStaffListLoaded] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [personOnTeamList, setPersonOnTeamList] = React.useState([]);

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditQuestionnaireDrawer: Context value changed:', true);
    const team = getAppContextValue('addPersonDrawerTeam');
    setTeamId(team.id);
    setTeamName(team.teamName);
  }, [getAppContextValue]);

  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['person-list-retrieve'],
    queryFn: ({ queryKey }) => weConnectQueryFn(queryKey[0], { teamId }),
  });

  if (isLoading) {
    console.log('Fetching all staff members list...');
  } else if (error) {
    console.log(`An error occurred with person-list-retrieve: ${error.message}`);
  } else if (isSuccess && !allStaffListLoaded) {
    setAllStaffListLoaded(true);
    // const personOnTeamListTemp = personListRetrieve(data, teamId);
    // setPersonOnTeamList(personOnTeamListTemp);
    console.log('Successfully retrieved person list for team...');
    setAllStaffList(data.personList);
  }

  const queryClient = useQueryClient();
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
        const updatedStaffList = allStaffList.filter((staff) => staff.id !== person.id);
        setAllStaffList(updatedStaffList);
      });
    }
  };

  return (
    <AddPersonDrawerMainContentWrapper>
      <SearchBarWrapper>
        <SearchBar2024
          placeholder="Search by name"
          // searchFunction={searchFunction}
          clearFunction={clearFunction}
          searchUpdateDelayTime={750}
        />
      </SearchBarWrapper>
      {(allStaffList && allStaffList.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonListTitle>Search Results:</PersonListTitle>
          <PersonList>
            {allStaffList.map((person) => (
              <PersonItem key={`personResult-${person.id}`}>
                {person.firstName}
                {' '}
                {person.lastName}
                {!arrayContains(person.id, teamMemberPersonIdList) && (
                  <>
                    {' '}
                    <SpanWithLinkStyle onClick={() => addClicked(person)}>add</SpanWithLinkStyle>
                    {/* <SpanWithLinkStyle onClick={() => TeamActions.addPersonToTeam(person.id, teamId)}>add</SpanWithLinkStyle> */}
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
          {allCachedPeopleList.map((person) => (
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
AddPersonDrawerMainContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

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

export default withStyles(styles)(AddPersonDrawerMainContent);
