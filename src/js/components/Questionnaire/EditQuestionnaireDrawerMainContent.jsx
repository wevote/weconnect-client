import { withStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import EditQuestionnaireForm from './EditQuestionnaireForm';


const EditQuestionnaireDrawerMainContent = () => {
  renderLog('EditQuestionnaireDrawerMainContent');

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
