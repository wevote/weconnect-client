import React from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
// import { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import AddTeamDrawerMainContent from '../Team/AddTeamDrawerMainContent';


// eslint-disable-next-line no-unused-vars
const AddTeamDrawer = ({ classes }) => {  //  classes, teamId
  renderLog('AddTeamDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);

  // const onAppObservableStoreChange = () => {
  // };

  const onRetrieveTeamChange = () => {
  };

  const onPersonStoreChange = () => {
    onRetrieveTeamChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamChange();
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    setHeaderTitleJsx(<>Add Team</>);

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <DrawerTemplateA
      drawerId="addTeamDrawer"
      drawerOpenGlobalVariableName="addTeamDrawerOpen"
      mainContentJsx={<AddTeamDrawerMainContent />}
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

// const AddTeamDrawerWrapper = styled('div')`
// `;

// const SearchBarWrapper = styled('div')`
//   margin-bottom: 16px;
// `;

export default withStyles(styles)(AddTeamDrawer);
