import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { useQuery } from '@tanstack/react-query';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import { renderLog } from '../../common/utils/logging';
import AddTeamForm from './AddTeamForm';
import weConnectQueryFn from '../../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const AddTeamDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('AddTeamDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  // const [allCachedPeopleList, setAllCachedPeopleList] = React.useState([]);
  // const [searchText, setSearchText] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [personSearchResultsList, setPersonSearchResultsList] = React.useState([]);
  // const [teamId, setTeamId] = React.useState(-1);
  // const [teamMemberPersonIdList, setTeamMemberPersonIdList] = React.useState([]);
  // const [teamList, setTeamList] = React.useState([]);
  const [teamCount] = React.useState(-1);


  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['person-list-retrieve'],
    queryFn: ({ queryKey }) => weConnectQueryFn(queryKey[0], {}),
  });

  if (isLoading) {
    console.log('Fetching teams...');
  } else if (error) {
    console.log(`An error occurred: ${error.message}`);
  } else if (isSuccess && teamCount < 0) {
    console.log('Successfully retrieved staff list...');
    console.log('AddTeamDrawerMainContent "person-list-retrieve" data:', data);
    // setTeamList(teamListTemp);
    // setTeamCount(teamListTemp.length);
  }

  // TODO: 12/6/25, temporarily removed to simplify debug
  // const searchFunction = (incomingSearchText) => {
  //   let searchingJustStarted = false;
  //   if (searchText.length === 0 && incomingSearchText.length > 0) {
  //     searchingJustStarted = true;
  //   }
  //   const isSearching = (incomingSearchText && incomingSearchText.length > 0);
  //   const teamIdTemp = AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId');
  //   if (apiCalming(`addPersonToTeamSearch-${teamIdTemp}-${incomingSearchText}`, 60000)) { // Only once per 60 seconds
  //     PersonActions.personListRetrieve(incomingSearchText);
  //   }
  //   setSearchText(incomingSearchText);
  // };

  const clearFunction = () => {
    setPersonSearchResultsList([]);
    // TODO setSearchText('');
  };

  return (
    <AddTeamDrawerMainContentWrapper>
      <SearchBarWrapper>
        <SearchBar2024
          placeholder="Search by team name"
          // searchFunction={searchFunction}
          searchFunction={() => console.log('searchFunction in AddTeamDrawerMainContent')}
          clearFunction={clearFunction}
          searchUpdateDelayTime={250}
        />
      </SearchBarWrapper>
      <AddTeamWrapper>
        <AddTeamForm />
      </AddTeamWrapper>
    </AddTeamDrawerMainContentWrapper>
  );
};
AddTeamDrawerMainContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

const AddTeamDrawerMainContentWrapper = styled('div')`
`;

const AddTeamWrapper = styled('div')`
  margin-top: 32px;
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default withStyles(styles)(AddTeamDrawerMainContent);
