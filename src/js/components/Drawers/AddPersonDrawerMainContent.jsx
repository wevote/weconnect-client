import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import TeamActions from '../../actions/TeamActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import apiCalming from '../../common/utils/apiCalming';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import { renderLog } from '../../common/utils/logging';
import AddPersonForm from '../AddPerson/AddPersonForm';


const AddPersonDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  const [searchText, setSearchText] = React.useState('');
  const [personSearchResultsList, setPersonSearchResultsList] = React.useState([]);
  const [teamId, setTeamId] = React.useState(-1);

  const onAppObservableStoreChange = () => {
    setTeamId(AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId'));
  };

  const onPersonStoreChange = () => {
    const personSearchResultsListTemp = PersonStore.getSearchResults();
    // console.log('AddPersonDrawerMainContent personSearchResultsList:', personSearchResultsListTemp);
    setPersonSearchResultsList(personSearchResultsListTemp);
  };

  const onTeamStoreChange = () => {
  };

  const searchFunction = (incomingSearchText) => {
    let searchingJustStarted = false;
    if (searchText.length === 0 && incomingSearchText.length > 0) {
      searchingJustStarted = true;
    }
    const isSearching = (incomingSearchText && incomingSearchText.length > 0);
    if (apiCalming(`addPersonToTeamSearch-${teamId}-${incomingSearchText}`, 60000)) { // Only once per 60 seconds
      PersonActions.personListRetrieve();
    }
    setSearchText(incomingSearchText);
  };

  const clearFunction = () => {
    setSearchText('');
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  React.useEffect(() => {
  }, [personSearchResultsList]);
  const personSearchResultsListTemp = PersonStore.getSearchResults();

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
      <AddPersonForm />
      {(personSearchResultsListTemp && personSearchResultsListTemp.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonSearchResultsTitle>Search Results:</PersonSearchResultsTitle>
          <PersonSearchResultsList>
            {personSearchResultsListTemp.map((person, index) => (
              <PersonSearchResultsItem key={`personResult-${person.id}`}>
                {person.firstName}
                {' '}
                {person.lastName}
                {' '}
                <AddPersonToTeamLinkStyle onClick={() => TeamActions.addPersonToTeam(person.id, teamId)}>add</AddPersonToTeamLinkStyle>
              </PersonSearchResultsItem>
            ))}
          </PersonSearchResultsList>
        </PersonSearchResultsWrapper>
      )}
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

const AddPersonToTeamLinkStyle = styled('span')`
  text-decoration:underline;
  color:#206DB3; /* primary500 */
  cursor:pointer;
`;

const PersonSearchResultsItem = styled('div')`
`;

const PersonSearchResultsList = styled('div')`
`;

const PersonSearchResultsTitle = styled('div')`
`;

const PersonSearchResultsWrapper = styled('div')`
  margin-top: 16px;
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default withStyles(styles)(AddPersonDrawerMainContent);
