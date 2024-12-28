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
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import AddTeamForm from './AddTeamForm';


const AddTeamDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('AddTeamDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  const [allCachedPeopleList, setAllCachedPeopleList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [personSearchResultsList, setPersonSearchResultsList] = React.useState([]);
  const [teamId, setTeamId] = React.useState(-1);
  const [teamMemberPersonIdList, setTeamMemberPersonIdList] = React.useState([]);

  const onAppObservableStoreChange = () => {
    // console.log('AddTeamDrawerMainContent AppObservableStore-addPersonDrawerTeamId: ', AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId'));
  };

  const onPersonStoreChange = () => {
  };

  const onTeamStoreChange = () => {
    // const teamSearchResultsListTemp = TeamStore.getSearchResults();
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

    if (apiCalming('teamListRetrieve', 30000)) {
      TeamActions.teamListRetrieve();
    }

    return () => {
      // console.log('AddTeamDrawerMainContent cleanup');
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <AddTeamDrawerMainContentWrapper>
      <SearchBarWrapper>
        <SearchBar2024
          placeholder="Search by team name"
          searchFunction={searchFunction}
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
