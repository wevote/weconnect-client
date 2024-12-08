import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
// import TeamActions from '../actions/TeamActions';
import TeamStore from '../../stores/TeamStore';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import { renderLog } from '../../common/utils/logging';


const AddPersonDrawer = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [mainContentJsx, setMainContentJsx] = React.useState(<></>);
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  const [searchText, setSearchText] = React.useState('');
  const [teamId, setTeamId] = React.useState(-1);

  const onAppObservableStoreChange = () => {
    setTeamId(AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId'));
  };

  const onRetrieveTeamChange = () => {
  };

  const onPersonStoreChange = () => {
    onRetrieveTeamChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamChange();
  };

  const searchFunction = (incomingSearchText) => {
    setSearchText(incomingSearchText);
  };

  const clearFunction = () => {
    setSearchText('');
  }

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    setHeaderTitleJsx(<>Add Team Member</>);
    setMainContentJsx(
      <AddPersonDrawerWrapper>
        <SearchBarWrapper>
          <SearchBar2024
            placeholder="Search by name"
            searchFunction={searchFunction}
            clearFunction={clearFunction}
            searchUpdateDelayTime={250}
          />
        </SearchBarWrapper>
      </AddPersonDrawerWrapper>
    );

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <DrawerTemplateA
      drawerOpenGlobalVariableName={'addPersonDrawerOpen'}
      mainContentJsx={mainContentJsx}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
AddPersonDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

const AddPersonDrawerWrapper = styled('div')`
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default withStyles(styles)(AddPersonDrawer);
