import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import AddPersonDrawer from './AddPersonDrawer';
import EditQuestionnaireDrawer from './EditQuestionnaireDrawer';
import EditPersonDrawer from './EditPersonDrawer';
import EditQuestionDrawer from './EditQuestionDrawer';
import EditTaskDefinitionDrawer from './EditTaskDefinitionDrawer';
import EditTaskGroupDrawer from './EditTaskGroupDrawer';
import PersonProfileDrawer from './PersonProfileDrawer';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';


const Drawers = () => {
  renderLog('Drawers');
  const { getAppContextValue } = useConnectAppContext();

  // Note 12/6/24, not using all these '...DrawerOpen' context values was more elegant, but lots of rendering was happening for little benefit.
  // Maybe there is a better way...
  let personProfile = getAppContextValue('personProfileDrawerOpen');
  const addPerson = getAppContextValue('addPersonDrawerOpen');
  // let team = getAppContextValue('addTeamDrawerOpen');
  const editPerson =  getAppContextValue('editPersonDrawerOpen');
  const question = getAppContextValue('editQuestionDrawerOpen');
  const questionnaire =  getAppContextValue('editQuestionnaireDrawerOpen');

  if (personProfile === undefined) {
    console.log('addTeamDrawerOpen setting it to false');
    personProfile = false;
    // team = false;
    // setAppContextValue('personProfileDrawerOpen', false);
    // setAppContextValue('addTeamDrawerOpen', false);
  }
  console.log('addTeamDrawerOpen =', getAppContextValue('addTeamDrawerOpen'));
  return (
    <DrawersWrapper>
      { personProfile === true ? <PersonProfileDrawer /> : null}
      { addPerson === true ? <AddPersonDrawer /> : null}
      {/* Now called directly from  { team === true ? <AddTeamDrawer /> : null }
      TODO: switch it back to being called from here 1/12/25
      */}
      { editPerson === true ? <EditPersonDrawer /> : null}
      { question === true ? <EditQuestionDrawer /> : null}
      {questionnaire === true ? <EditQuestionnaireDrawer /> : null}
      <EditTaskDefinitionDrawer />
      <EditTaskGroupDrawer />
    </DrawersWrapper>
  );
};

const styles = () => ({
});

const DrawersWrapper = styled('div')`
`;

export default withStyles(styles)(Drawers);
