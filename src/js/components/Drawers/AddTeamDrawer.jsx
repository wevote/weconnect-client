import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import { messageService } from '../../stores/AppObservableStore';
// import TeamActions from '../actions/TeamActions';
import TeamStore from '../../stores/TeamStore';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import { renderLog } from '../../common/utils/logging';
import AddTeamForm from '../AddTeam/AddTeamForm';


const AddTeamDrawer = ({ classes }) => {  //  classes, teamId
  renderLog('AddTeamDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [mainContentJsx, setMainContentJsx] = React.useState(<></>);
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  const [searchText, setSearchText] = React.useState('');

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamChange = () => {
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamChange();
  };

  const searchFunction = (incomingSearchText) => {
    setSearchText(incomingSearchText);
  };

  const clearFunction = () => {
    setSearchText('');
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    setHeaderTitleJsx(<>Add Team</>);
    const mainContentJsxTemp = (
      <AddTeamDrawerWrapper>
        <SearchBarWrapper>
          <SearchBar2024
            placeholder="Search by team name"
            searchFunction={searchFunction}
            clearFunction={clearFunction}
            searchUpdateDelayTime={250}
          />
        </SearchBarWrapper>
        <AddTeamForm />
      </AddTeamDrawerWrapper>
    );
    setMainContentJsx(mainContentJsxTemp);

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <DrawerTemplateA
      drawerId="addTeamDrawer"
      drawerOpenGlobalVariableName="addTeamDrawerOpen"
      mainContentJsx={mainContentJsx}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
AddTeamDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

const AddTeamDrawerWrapper = styled('div')`
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default withStyles(styles)(AddTeamDrawer);
