import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import { renderLog } from '../../common/utils/logging';
import prepareDataPackageFromAppObservableStore from '../../common/utils/prepareDataPackageFromAppObservableStore';

const QUESTIONNAIRE_FIELDS_IN_FORM = [
  'questionnaireInstructions', 'questionnaireName', 'questionnaireTitle'];

const EditQuestionnaireForm = ({ classes }) => {
  renderLog('EditQuestionnaireForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [firstQuestionnaireDataReceived, setFirstQuestionnaireDataReceived] = React.useState(false);
  const [inputValues, setInputValues] = React.useState({});
  // const [questionnaireId, setQuestionnaireId] = React.useState(-1);
  // const [questionnaireDictAlreadySaved, setQuestionnaireDictAlreadySaved] = React.useState({});
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const clearEditFormValuesInAppObservableStore = () => {
    const globalVariableStates = {};
    for (let i = 0; i < QUESTIONNAIRE_FIELDS_IN_FORM.length; i++) {
      const fieldName = QUESTIONNAIRE_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editQuestionnaireDrawerQuestionnaireId = -1;
    // console.log('clearEditFormValuesInAppObservableStore globalVariableStates:', globalVariableStates);
    AppObservableStore.setGlobalVariableStateInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstQuestionnaireDataReceived(false);
    // setQuestionnaireId(-1);
    clearEditFormValuesInAppObservableStore();
    AppObservableStore.setGlobalVariableState('editQuestionnaireDrawerOpen', false);
  };

  const updateInputValuesFromQuestionnaireStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionnaireDrawerQuestionnaireId');
    const questionnaireDict = QuestionnaireStore.getQuestionnaireById(questionnaireIdTemp) || {};
    // console.log('=== updateInputValuesFromQuestionnaireStore questionnaireIdTemp:', questionnaireIdTemp, ', questionnaireDict:', questionnaireDict);
    if (questionnaireIdTemp && questionnaireDict.questionnaireId) {
      // console.log('questionnaireIdTemp:', questionnaireIdTemp, ', questionnaireDict.questionnaireId:', questionnaireDict.questionnaireId);
      // setQuestionnaireDictAlreadySaved(questionnaireDict);
      for (let i = 0; i < QUESTIONNAIRE_FIELDS_IN_FORM.length; i++) {
        const fieldName = QUESTIONNAIRE_FIELDS_IN_FORM[i];
        revisedInputValues[fieldName] = questionnaireDict[fieldName];
      }
    }
    return revisedInputValues;
  };

  const onAppObservableStoreChange = () => {
    const editQuestionnaireDrawerOpenTemp = AppObservableStore.getGlobalVariableState('editQuestionnaireDrawerOpen');
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionnaireDrawerQuestionnaireId');
    if (questionnaireIdTemp >= 0 && !editQuestionnaireDrawerOpenTemp) {
      clearEditedValues();
    }
  };

  const onQuestionnaireStoreChange = () => {
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionnaireDrawerQuestionnaireId');
    const questionnaireDict = QuestionnaireStore.getQuestionnaireById(questionnaireIdTemp) || {};
    if (!firstQuestionnaireDataReceived) {
      if (questionnaireIdTemp && questionnaireDict.questionnaireId) {
        const inputValuesRevised = updateInputValuesFromQuestionnaireStore(inputValues);
        setFirstQuestionnaireDataReceived(true);
        setInputValues(inputValuesRevised);
      }
    }
  };

  const saveQuestionnaire = () => {
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionnaireDrawerQuestionnaireId');
    const data = prepareDataPackageFromAppObservableStore(QUESTIONNAIRE_FIELDS_IN_FORM);
    // console.log('saveQuestionnaire data:', data);
    QuestionnaireActions.questionnaireSave(questionnaireIdTemp, data);
    setSaveButtonActive(false);
    setTimeout(() => {
      clearEditedValues();
    }, 250);
  };

  const updateQuestionnaireField = (event) => {
    if (event.target.name) {
      const newValue = event.target.value || '';
      AppObservableStore.setGlobalVariableState(`${event.target.name}Changed`, true);
      AppObservableStore.setGlobalVariableState(`${event.target.name}ToBeSaved`, newValue);
      // console.log('updateQuestionnaireField:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updateQuestionnaireField Invalid event:', event);
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
    };
  }, []);

  return (
    <EditQuestionnaireFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="questionnaireNameToBeSaved"
          label="Questionnaire Internal Name"
          name="questionnaireName"
          margin="dense"
          onChange={updateQuestionnaireField}
          placeholder="Name of the questionnaire, staff only"
          value={inputValues.questionnaireName || ''}
          variant="outlined"
        />
        <TextField
          id="questionnaireTitleToBeSaved"
          label="Questionnaire Visible Title"
          margin="dense"
          multiline
          name="questionnaireTitle"
          onChange={updateQuestionnaireField}
          placeholder="Title shown"
          rows={2}
          value={inputValues.questionnaireTitle || ''}
          variant="outlined"
        />
        <TextField
          id="questionnaireInstructionsToBeSaved"
          label="Instructions"
          margin="dense"
          multiline
          name="questionnaireInstructions"
          onChange={updateQuestionnaireField}
          placeholder="Instructions for filling out questionnaire"
          rows={6}
          value={inputValues.questionnaireInstructions || ''}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveQuestionnaireButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={saveQuestionnaire}
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
