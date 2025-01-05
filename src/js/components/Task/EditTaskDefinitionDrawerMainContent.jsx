import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import PersonActions from '../../actions/PersonActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import EditTaskDefinitionForm from './EditTaskDefinitionForm';


const EditTaskDefinitionDrawerMainContent = () => {
  renderLog('EditTaskDefinitionDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders

  React.useEffect(() => {
    if (apiCalming('personListRetrieve', 30000)) {
      PersonActions.personListRetrieve();
    }
  }, []);

  return (
    <EditTaskDefinitionDrawerMainContentWrapper>
      <AddTaskDefinitionWrapper>
        <EditTaskDefinitionForm />
      </AddTaskDefinitionWrapper>
    </EditTaskDefinitionDrawerMainContentWrapper>
  );
};

const styles = () => ({
});

const EditTaskDefinitionDrawerMainContentWrapper = styled('div')`
`;

const AddTaskDefinitionWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(styles)(EditTaskDefinitionDrawerMainContent);
