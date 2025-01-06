import React, { useEffect } from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
// import PersonStore from '../../stores/PersonStore';
// import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import EditPersonDrawerMainContent from '../Person/EditPersonDrawerMainContent';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';

// eslint-disable-next-line no-unused-vars
const EditPersonDrawer = ({ classes }) => {  //  classes, teamId
  renderLog('EditPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  // eslint-disable-next-line no-unused-vars
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [teamId, setTeamId] = React.useState(-1);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditPersonDrawer: Context value changed:', true);
    setTeamId(getAppContextValue('editPersonDrawerTeamId'));
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   setTeamId(getAppContextValue('editPersonDrawerTeamId'));
  // };

  // const onRetrieveTeamChange = () => {
  // };

  // const onPersonStoreChange = () => {
  //   onRetrieveTeamChange();
  // };
  //
  // const onTeamStoreChange = () => {
  //   onRetrieveTeamChange();
  // };

  // React.useEffect(() => {
  //   // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
  //   // onAppObservableStoreChange();
  //   const personStoreListener = PersonStore.addListener(onPersonStoreChange);
  //   onPersonStoreChange();
  //   const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
  //   onTeamStoreChange();
  //
  //   setHeaderTitleJsx(<>Edit Person</>);
  //
  //   return () => {
  //     // appStateSubscription.unsubscribe();
  //     personStoreListener.remove();
  //     teamStoreListener.remove();
  //   };
  // }, []);

  return (
    <DrawerTemplateA
      drawerId="editPersonDrawer"
      drawerOpenGlobalVariableName="editPersonDrawerOpen"
      mainContentJsx={<EditPersonDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditPersonDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

// const EditPersonDrawerWrapper = styled('div')`
// `;

export default withStyles(styles)(EditPersonDrawer);
