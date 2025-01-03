import React, { useEffect } from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import AddPersonDrawerMainContent from '../Person/AddPersonDrawerMainContent';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';


// eslint-disable-next-line no-unused-vars
const AddPersonDrawer = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [teamId, setTeamId] = React.useState(-1);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of WeAppContext changes

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('AddPersonDrawer: Context value changed:', true);
    setTeamId(getAppContextValue('addPersonDrawerTeamId'));
  }, [getAppContextValue]);

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

    setHeaderTitleJsx(<>Add Team Member</>);

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <DrawerTemplateA
      drawerId="addPersonDrawer"
      drawerOpenGlobalVariableName="addPersonDrawerOpen"
      mainContentJsx={<AddPersonDrawerMainContent />}
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

// const AddPersonDrawerWrapper = styled('div')`
// `;
//
// const SearchBarWrapper = styled('div')`
//   margin-bottom: 16px;
// `;

export default withStyles(styles)(AddPersonDrawer);
