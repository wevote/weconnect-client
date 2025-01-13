import { Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import { renderLog } from '../../common/utils/logging';
import PrepareDataPackageFromAppObservableStore from '../../common/utils/PrepareDataPackageFromAppObservableStore';

const QUESTION_FIELDS_IN_FORM = [
  'answerType', 'fieldMappingRule', 'questionInstructions', 'questionText',
  'requireAnswer', 'statusActive'];

const EditQuestionForm = ({ classes }) => {
  renderLog('EditQuestionForm');
  const { setAppContextValue, getAppContextValue, setAppContextValuesInBulk } = useConnectAppContext();

  const [firstQuestionDataReceived, setFirstQuestionDataReceived] = React.useState(false);
  const [inputValues, setInputValues] = React.useState({
    answerType: '',
    questionInstructions: '',
    questionText: '',
    requireAnswer: false,
    statusActive: true,
  });
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  // const [questionId, setQuestionId] = React.useState(-1);
  // const [questionDictAlreadySaved, setQuestionDictAlreadySaved] = React.useState({});

  // const noNotch = {
  //   '& .MuiOutlinedInput-notchedOutline legend': {
  //     display: 'none',
  //   },
  // };

  const clearEditFormValuesInAppContext = () => {
    const globalVariableStates = {};
    for (let i = 0; i < QUESTION_FIELDS_IN_FORM.length; i++) {
      const fieldName = QUESTION_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editQuestionDrawerQuestionId = -1;
    // console.log('clearEditFormValuesInAppContext globalVariableStates:', globalVariableStates);
    setAppContextValuesInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstQuestionDataReceived(false);
    // setQuestionId(-1);
    clearEditFormValuesInAppContext();
    setAppContextValue('editQuestionDrawerOpen', false);
  };

  const updateInputValuesFromQuestionnaireStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
    const questionDict = QuestionnaireStore.getQuestionById(questionIdTemp) || {};
    // console.log('=== updateInputValuesFromQuestionnaireStore questionIdTemp:', questionIdTemp, ', questionDict:', questionDict);
    if (questionIdTemp && questionDict.questionId) {
      // console.log('questionIdTemp:', questionIdTemp, ', questionDict.questionId:', questionDict.questionId);
      // setQuestionDictAlreadySaved(questionDict);
      for (let i = 0; i < QUESTION_FIELDS_IN_FORM.length; i++) {
        const fieldName = QUESTION_FIELDS_IN_FORM[i];
        revisedInputValues[fieldName] = questionDict[fieldName];
      }
    }
    return revisedInputValues;
  };

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditQuestionForm: Context value changed:', true);
    const editQuestionDrawerOpenTemp = getAppContextValue('editQuestionDrawerOpen');
    const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
    if (questionIdTemp >= 0 && !editQuestionDrawerOpenTemp) {
      clearEditedValues();
    }
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   const editQuestionDrawerOpenTemp = getAppContextValue('editQuestionDrawerOpen');
  //   const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
  //   if (questionIdTemp >= 0 && !editQuestionDrawerOpenTemp) {
  //     clearEditedValues();
  //   }
  // };

  const onQuestionnaireStoreChange = () => {
    const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
    const questionDict = QuestionnaireStore.getQuestionById(questionIdTemp) || {};
    // console.log('EditQuestionForm onQuestionnaireStoreChange questionIdTemp:', questionIdTemp, ', questionDict:', questionDict);
    if (!firstQuestionDataReceived) {
      // console.log('onQuestionnaireStoreChange firstQuestionDataReceived:', firstQuestionDataReceived);
      if (questionIdTemp && questionDict.questionId) {
        const inputValuesRevised = updateInputValuesFromQuestionnaireStore(inputValues);
        setFirstQuestionDataReceived(true);
        setInputValues(inputValuesRevised);
      }
    }
  };

  const saveQuestion = () => {
    const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
    const questionnaireIdTemp = getAppContextValue('editQuestionDrawerQuestionnaireId');
    const data = PrepareDataPackageFromAppObservableStore(QUESTION_FIELDS_IN_FORM);
    // console.log('saveQuestion questionId: ', questionIdTemp, ', data:', data);
    QuestionnaireActions.questionSave(questionnaireIdTemp, questionIdTemp, data);
    setSaveButtonActive(false);
    setTimeout(() => {
      clearEditedValues();
    }, 250);
  };

  const updateQuestionField = (event) => {
    if (event.target.name) {
      let newValue;
      if (event.target.type === 'checkbox') {
        newValue = event.target.checked;
      } else {
        newValue = event.target.value || '';
      }
      setAppContextValue(`${event.target.name}Changed`, true);
      setAppContextValue(`${event.target.name}ToBeSaved`, newValue);
      // console.log('updateQuestionField:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updateQuestionField Invalid event:', event);
    }
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
    };
  }, []);

  return (
    <EditQuestionFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="questionTextToBeSaved"
          label="Question"
          margin="dense"
          multiline
          name="questionText"
          onChange={updateQuestionField}
          placeholder="Question you are asking"
          rows={6}
          // sx={noNotch}
          value={inputValues.questionText || ''}
          variant="outlined"
        />
        <TextField
          id="questionInstructionsToBeSaved"
          label="Special Instructions"
          name="questionInstructions"
          margin="dense"
          multiline
          rows={4}
          variant="outlined"
          placeholder="Instructions to clarify the question"
          value={inputValues.questionInstructions || ''}
          onChange={updateQuestionField}
        />
        <TextField
          id="answerTypeToBeSaved"
          label="Type of Answer"
          name="answerType"
          margin="dense"
          variant="outlined"
          placeholder="Text answer? Number answer? Checkboxes?"
          value={inputValues.answerType || ''}
          onChange={updateQuestionField}
        />
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              id="requireAnswerToBeSaved"
              checked={Boolean(inputValues.requireAnswer)}
              classes={{ root: classes.checkboxRoot }}
              color="primary"
              name="requireAnswer"
              onChange={updateQuestionField}
            />
          )}
          label="Require an answer to this question"
        />
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              id="statusActiveToBeSaved"
              checked={Boolean(inputValues.statusActive)}
              classes={{ root: classes.checkboxRoot }}
              color="primary"
              name="statusActive"
              onChange={updateQuestionField}
            />
          )}
          label="Question is active"
        />
        <Button
          classes={{ root: classes.saveQuestionButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={saveQuestion}
        >
          Save Question
        </Button>
      </FormControl>
    </EditQuestionFormWrapper>
  );
};
EditQuestionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  checkboxRoot: {
    paddingTop: 0,
    paddingLeft: '9px',
    paddingBottom: 0,
  },
  checkboxLabel: {
    marginTop: 2,
  },
  formControl: {
    width: '100%',
  },
  saveQuestionButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 0 !important;
`;

const EditQuestionFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditQuestionForm);
