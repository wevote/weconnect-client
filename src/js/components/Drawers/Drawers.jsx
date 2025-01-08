import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import AddPersonDrawer from './AddPersonDrawer';
import EditQuestionnaireDrawer from './EditQuestionnaireDrawer';
import AddTeamDrawer from './AddTeamDrawer';
import EditPersonDrawer from './EditPersonDrawer';
import EditQuestionDrawer from './EditQuestionDrawer';
import PersonProfileDrawer from './PersonProfileDrawer';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';


const Drawers = () => {  //  classes, teamId
  renderLog('Drawers');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes

  // Note 12/6/24, not using all these '...DrawerOpen' context values was more elegant, but lots of rendering was happening for little benefit.
  // Maybe there is a better way...
  let personProfile = getAppContextValue('personProfileDrawerOpen');
  const addPerson = getAppContextValue('addPersonDrawerOpen');
  let team = getAppContextValue('addTeamDrawerOpen');
  const editPerson =  getAppContextValue('editPersonDrawerOpen');
  const question = getAppContextValue('editQuestionDrawerOpen');
  const questionnaire =  getAppContextValue('editQuestionnaireDrawerOpen');

  if (personProfile === undefined) {
    console.log('addTeamDrawerOpen setting it to false');
    personProfile = false;
    team = false;
    // setAppContextValue('personProfileDrawerOpen', false);
    // setAppContextValue('addTeamDrawerOpen', false);
  }
  console.log('addTeamDrawerOpen =', getAppContextValue('addTeamDrawerOpen'));
  return (
    <DrawersWrapper>
      { personProfile === true ? <PersonProfileDrawer /> : null}
      { addPerson === true ? <AddPersonDrawer /> : null}
      { team === true ? <AddTeamDrawer /> : null }
      { editPerson === true ? <EditPersonDrawer /> : null}
      { question === true ? <EditQuestionDrawer /> : null}
      {questionnaire === true ? <EditQuestionnaireDrawer /> : null}
    </DrawersWrapper>
  );
};

const styles = () => ({
});

const DrawersWrapper = styled('div')`
`;

export default withStyles(styles)(Drawers);
