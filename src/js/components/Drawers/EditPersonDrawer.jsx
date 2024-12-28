import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import EditPersonDrawerMainContent from './EditPersonDrawerMainContent';


const EditPersonDrawer = ({ classes }) => {  //  classes, teamId
  renderLog('EditPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  const [teamId, setTeamId] = React.useState(-1);

  const onAppObservableStoreChange = () => {
    setTeamId(AppObservableStore.getGlobalVariableState('editPersonDrawerTeamId'));
  };

  const onRetrieveTeamChange = () => {
  };

  const onPersonStoreChange = () => {
    onRetrieveTeamChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamChange();
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    setHeaderTitleJsx(<>Edit Person</>);

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

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

const EditPersonDrawerWrapper = styled('div')`
`;

export default withStyles(styles)(EditPersonDrawer);