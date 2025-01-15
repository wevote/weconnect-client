import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import { renderLog } from '../../common/utils/logging';
import EditQuestionnaireForm from './EditQuestionnaireForm';


const EditQuestionnaireDrawerMainContent = () => {
  renderLog('EditQuestionnaireDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders

  // React.useEffect(() => {
  //   if (apiCalming('personListRetrieve', 30000)) {
  //     PersonActions.personListRetrieve();
  //   }
  // }, []);

  return (
    <EditQuestionnaireDrawerMainContentWrapper>
      <AddQuestionnaireWrapper>
        <EditQuestionnaireForm />
      </AddQuestionnaireWrapper>
    </EditQuestionnaireDrawerMainContentWrapper>
  );
};

const styles = () => ({
});

const EditQuestionnaireDrawerMainContentWrapper = styled('div')`
`;

const AddQuestionnaireWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(styles)(EditQuestionnaireDrawerMainContent);
