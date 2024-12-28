import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import TeamActions from '../../actions/TeamActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import apiCalming from '../../common/utils/apiCalming';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import AddPersonForm from './AddPersonForm';


const AddPersonDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  const [allCachedPeopleList, setAllCachedPeopleList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [personSearchResultsList, setPersonSearchResultsList] = React.useState([]);
  const [teamId, setTeamId] = React.useState(-1);
  const [teamMemberPersonIdList, setTeamMemberPersonIdList] = React.useState([]);

  const onAppObservableStoreChange = () => {
    // console.log('AddPersonDrawerMainContent AppObservableStore-addPersonDrawerTeamId: ', AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId'));
    setTeamId(AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId'));
  };

  const onPersonStoreChange = () => {
    const personSearchResultsListTemp = PersonStore.getSearchResults();
    // console.log('AddPersonDrawerMainContent personSearchResultsList:', personSearchResultsListTemp);
    setAllCachedPeopleList(PersonStore.getAllCachedPeopleList());
    setPersonSearchResultsList(personSearchResultsListTemp);
    const teamIdTemp = AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId');
    // console.log('AddPersonDrawerMainContent-onPersonStoreChange teamIdTemp: ', teamIdTemp, ', teamMemberPersonIdList:', TeamStore.getTeamMemberPersonIdList(teamIdTemp));
    setTeamMemberPersonIdList(TeamStore.getTeamMemberPersonIdList(teamIdTemp));
    setTeamId(teamIdTemp);
  };

  const onTeamStoreChange = () => {
    const teamIdTemp = AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId');
    // console.log('AddPersonDrawerMainContent-onTeamStoreChange teamIdTemp: ', teamIdTemp, ', teamMemberPersonIdList:', TeamStore.getTeamMemberPersonIdList(teamIdTemp));
    setTeamMemberPersonIdList(TeamStore.getTeamMemberPersonIdList(teamIdTemp));
    setTeamId(teamIdTemp);
  };

  const searchFunction = (incomingSearchText) => {
    let searchingJustStarted = false;
    if (searchText.length === 0 && incomingSearchText.length > 0) {
      searchingJustStarted = true;
    }
    const isSearching = (incomingSearchText && incomingSearchText.length > 0);
    const teamIdTemp = AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId');
    if (apiCalming(`addPersonToTeamSearch-${teamIdTemp}-${incomingSearchText}`, 60000)) { // Only once per 60 seconds
      PersonActions.personListRetrieve(incomingSearchText);
    }
    setSearchText(incomingSearchText);
  };

  const clearFunction = () => {
    setPersonSearchResultsList([]);
    setSearchText('');
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    if (apiCalming('personListRetrieve', 30000)) {
      PersonActions.personListRetrieve();
    }

    return () => {
      // console.log('AddPersonDrawerMainContent cleanup');
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <AddPersonDrawerMainContentWrapper>
      <SearchBarWrapper>
        <SearchBar2024
          placeholder="Search by name"
          searchFunction={searchFunction}
          clearFunction={clearFunction}
          searchUpdateDelayTime={750}
        />
      </SearchBarWrapper>
      {(personSearchResultsList && personSearchResultsList.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonListTitle>Search Results:</PersonListTitle>
          <PersonList>
            {personSearchResultsList.map((person, index) => (
              <PersonItem key={`personResult-${person.id}`}>
                {person.firstName}
                {' '}
                {person.lastName}
                {!arrayContains(person.id, teamMemberPersonIdList) && (
                  <>
                    {' '}
                    <SpanWithLinkStyle onClick={() => TeamActions.addPersonToTeam(person.id, teamId)}>add</SpanWithLinkStyle>
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
          {allCachedPeopleList.map((person, index) => (
            <PersonItem key={`personResult-${person.id}`}>
              {person.firstName}
              {' '}
              {person.lastName}
              {!arrayContains(person.id, teamMemberPersonIdList) && (
                <>
                  {' '}
                  <SpanWithLinkStyle onClick={() => TeamActions.addPersonToTeam(person.id, teamId)}>add</SpanWithLinkStyle>
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
