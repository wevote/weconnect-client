import React from 'react';
// import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
// import { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import PersonProfileDrawerMainContent from '../Person/PersonProfileDrawerMainContent';


const PersonProfileDrawer = () => {
  renderLog('PersonProfileDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  // eslint-disable-next-line no-unused-vars
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  // const [teamId, setTeamId] = React.useState(-1);

  // const onAppObservableStoreChange = () => {
  //   // setTeamId(AppObservableStore.getGlobalVariableState('personProfileDrawerTeamId'));
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

    // setHeaderTitleJsx(<>Person Profile</>);

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <DrawerTemplateA
      drawerId="personProfileDrawer"
      drawerOpenGlobalVariableName="personProfileDrawerOpen"
      mainContentJsx={<PersonProfileDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};

const styles = () => ({
});

// const PersonProfileDrawerWrapper = styled('div')`
// `;

export default withStyles(styles)(PersonProfileDrawer);
