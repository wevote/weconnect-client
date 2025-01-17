import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import makeRequestParams from '../../common/utils/requestParamsUtils';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';


const EditQuestionnaireForm = ({ classes }) => {
  renderLog('EditQuestionnaireForm');
  const { getAppContextValue } = useConnectAppContext();

  const [questionnaire]  = React.useState(getAppContextValue('selectedQuestionnaire'));
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);
  const [nameFldValue, setNameFldValue] = React.useState('');
  const [titleFldValue, setTitleFldValue] = React.useState('');
  const [instructionsFldValue, setInstructionsFldValue] = React.useState('');

  const queryClient = useQueryClient();
  const nameFldRef = useRef('');
  const titleFldRef = useRef('');
  const instructionsFldRef = useRef('');

  useEffect(() => {
    if (questionnaire) {
      setNameFldValue(questionnaire.questionnaireName);
      setTitleFldValue(questionnaire.questionnaireTitle);
      setInstructionsFldValue(questionnaire.questionnaireInstructions);
    } else {
      setNameFldValue('');
      setTitleFldValue('');
      setInstructionsFldValue('');
    }
  }, [questionnaire]);

  const questionnaireSaveMutation = useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('questionnaire-save', requestParams),
    onSuccess: () => {
      // console.log('--------- questionnaireSaveMutation mutated ---------');
      queryClient.invalidateQueries('questionnaire-list-retrieve').then(() => {});
    },
  });

  const saveQuestionnaire = () => {
    const params = {
      questionnaireName: nameFldRef.current.value,
      questionnaireTitle: titleFldRef.current.value,
      questionnaireInstructions: instructionsFldRef.current.value,
    };
    const plainParams = {
      questionnaireId: questionnaire ? questionnaire.id : '-1',
    };
    const requestParams = makeRequestParams(plainParams, params);
    questionnaireSaveMutation.mutate(requestParams);
    // console.log('saveQuestionnaire requestParams:', requestParams);
    setSaveButtonActive(false);
  };

  const updateSaveButton = () => {
    if (nameFldRef.current.value && nameFldRef.current.value.length &&
      titleFldRef.current.value && titleFldRef.current.value.length &&
      instructionsFldRef.current.value && instructionsFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  return (
    <EditQuestionnaireFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={nameFldValue}
          id="questionnaireNameToBeSaved"
          inputRef={nameFldRef}
          label="Questionnaire Internal Name"
          margin="dense"
          name="questionnaireName"
          onChange={() => updateSaveButton()}
          placeholder="Name of the questionnaire, staff only"
          variant="outlined"
        />
        <TextField
          defaultValue={titleFldValue}
          id="questionnaireTitleToBeSaved"
          inputRef={titleFldRef}
          label="Questionnaire Visible Title"
          margin="dense"
          multiline
          name="questionnaireTitle"
          onChange={() => updateSaveButton()}
          placeholder="Title shown"
          rows={2}
          variant="outlined"
        />
        <TextField
          defaultValue={instructionsFldValue}
          id="questionnaireInstructionsToBeSaved"
          inputRef={instructionsFldRef}
          label="Instructions"
          margin="dense"
          multiline
          name="questionnaireInstructions"
          onChange={() => updateSaveButton()}
          placeholder="Instructions for filling out questionnaire"
          rows={6}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveQuestionnaireButton }}
          color="primary"
          disabled={!saveButtonActive}
          onClick={saveQuestionnaire}
          variant="contained"
        >
          Save Questionnaire
        </Button>
      </FormControl>
    </EditQuestionnaireFormWrapper>
  );
};
EditQuestionnaireForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveQuestionnaireButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EditQuestionnaireFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditQuestionnaireForm);
