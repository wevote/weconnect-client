import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import { renderLog } from '../../common/utils/logging';
import weConnectQueryFn from '../../react-query/WeConnectQuery';
import makeRequestParams from '../../common/utils/requestParamsUtils';

// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';

const QUESTIONNAIRE_FIELDS_IN_FORM = [
  'questionnaireInstructions', 'questionnaireName', 'questionnaireTitle'];

const EditQuestionnaireForm = ({ classes }) => {
  renderLog('EditQuestionnaireForm');
  const { setAppContextValue, getAppContextValue, setAppContextValuesInBulk } = useConnectAppContext();

  // eslint-disable-next-line no-unused-vars
  const [firstQuestionnaireDataReceived, setFirstQuestionnaireDataReceived] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [inputValues, setInputValues] = React.useState({});
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const queryClient = useQueryClient();
  const nameFldRef = useRef('');
  const titleFldRef = useRef('');
  const instructionsFldRef = useRef('');

  // const [questionnaireId, setQuestionnaireId] = React.useState(-1);
  // const [questionnaireDictAlreadySaved, setQuestionnaireDictAlreadySaved] = React.useState({});


  const clearEditFormValuesInAppObservableStore = () => {
    const globalVariableStates = {};
    for (let i = 0; i < QUESTIONNAIRE_FIELDS_IN_FORM.length; i++) {
      const fieldName = QUESTIONNAIRE_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editQuestionnaireDrawerQuestionnaireId = -1;
    // console.log('clearEditFormValuesInAppObservableStore globalVariableStates:', globalVariableStates);
    setAppContextValuesInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstQuestionnaireDataReceived(false);
    // setQuestionnaireId(-1);
    clearEditFormValuesInAppObservableStore();
    setAppContextValue('editQuestionnaireDrawerOpen', false);
  };

  // eslint-disable-next-line no-unused-vars
  const updateInputValuesFromQuestionnaireStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
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

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditQuestionnaireForm: Context value changed:', true);
    const editQuestionnaireDrawerOpenTemp = getAppContextValue('editQuestionnaireDrawerOpen');
    const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
    if (questionnaireIdTemp >= 0 && !editQuestionnaireDrawerOpenTemp) {
      clearEditedValues();
    }
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   const editQuestionnaireDrawerOpenTemp = getAppContextValue('editQuestionnaireDrawerOpen');
  //   const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
  //   if (questionnaireIdTemp >= 0 && !editQuestionnaireDrawerOpenTemp) {
  //     clearEditedValues();
  //   }
  // };

  // const onQuestionnaireStoreChange = () => {
  //   const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
  //   const questionnaireDict = QuestionnaireStore.getQuestionnaireById(questionnaireIdTemp) || {};
  //   if (!firstQuestionnaireDataReceived) {
  //     if (questionnaireIdTemp && questionnaireDict.questionnaireId) {
  //       const inputValuesRevised = updateInputValuesFromQuestionnaireStore(inputValues);
  //       setFirstQuestionnaireDataReceived(true);
  //       setInputValues(inputValuesRevised);
  //     }
  //   }
  // };

  // http://localhost:4500/apis/v1/questionnaire-save/?questionnaireId=-1&incomingData=undefined
  const questionnaireSaveMutation = useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('questionnaire-save', requestParams),
    onSuccess: () => {
      console.log('--------- questionnaireSaveMutation mutated ---------');
      queryClient.invalidateQueries('questionnaire-list-retrieve').then(() => {});
    },
  });

  // eslint-disable-next-line no-unused-vars
  const updateSaveButton = (event) => {
    if (nameFldRef.current.value && nameFldRef.current.value.length &&
      titleFldRef.current.value && titleFldRef.current.value.length &&
      instructionsFldRef.current.value && instructionsFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  // const makeSavePersonDict = (data) => {
  //   let requestParams = '?';
  //   Object.keys(data).forEach((key) => {
  //     requestParams += `${key}ToBeSaved=${data[key]}&`;
  //     requestParams += `${key}Changed=${true}&`;
  //   });
  //   requestParams += `questionnaireId=-1`;
  //   return encodeURI(requestParams);
  // };

  const saveQuestionnaire = () => {
    // http://localhost:4500/apis/v1/questionnaire-save/
    // questionnaireId=-1&questionnaireNameToBeSaved=steve%201&questionnaireNameChanged=true&questionnaireTitleToBeSaved=steve%20one&questionnaireTitleChanged=true&questionnaireInstructionsToBeSaved=inst&questionnaireInstructionsChanged=true
    // http://localhost:4500/apis/v1/questionnaire-save/?questionnaireId=-1&questionnaireInstructionsChanged=true&questionnaireInstructionsToBeSaved=Do%20some%20stuff&questionnaireNameChanged=true&questionnaireNameToBeSaved=steve%27s%20q&questionnaireTitleChanged=true&questionnaireTitleToBeSaved=steve%20q%201
    const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
    const params = {
      questionnaireName: nameFldRef.current.value,
      questionnaireTitle: titleFldRef.current.value,
      questionnaireInstructions: instructionsFldRef.current.value,
    };
    // const requestParams = makeSavePersonDict(params);
    const requestParams = makeRequestParams('questionnaireId=-1', params);
    // ?questionnaireId=-1&questionnaireNameToBeSaved=were&questionnaireNameChanged=true&questionnaireTitleToBeSaved=drte3e&questionnaireTitleChanged=true&questionnaireInstructionsToBeSaved=get&questionnaireInstructionsChanged=true&

    // const data = prepareDataPackageFromAppObservableStore(QUESTIONNAIRE_FIELDS_IN_FORM);  // hack
    questionnaireSaveMutation.mutate(questionnaireIdTemp, requestParams);
    console.log('saveQuestionnaire requestParams:', requestParams);
    // QuestionnaireActions.questionnaireSave(questionnaireIdTemp, data);
    setSaveButtonActive(false);
    setTimeout(() => {
      clearEditedValues();
    }, 250);
  };

  // const updateQuestionnaireField = (event) => {
  //   if (event.target.name) {
  //     const newValue = event.target.value || '';
  //     setAppContextValue(`${event.target.name}Changed`, true);
  //     setAppContextValue(`${event.target.name}ToBeSaved`, newValue);
  //     // console.log('updateQuestionnaireField:', event.target.name, ', newValue:', newValue);
  //     setInputValues({ ...inputValues, [event.target.name]: newValue });
  //     setSaveButtonActive(true);
  //   } else {
  //     console.error('updateQuestionnaireField Invalid event:', event);
  //   }
  // };


  return (
    <EditQuestionnaireFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="questionnaireNameToBeSaved"
          label="Questionnaire Internal Name"
          name="questionnaireName"
          margin="dense"
          onChange={updateSaveButton}
          placeholder="Name of the questionnaire, staff only"
          inputRef={nameFldRef}
          variant="outlined"
        />
        <TextField
          id="questionnaireTitleToBeSaved"
          label="Questionnaire Visible Title"
          margin="dense"
          multiline
          name="questionnaireTitle"
          onChange={updateSaveButton}
          placeholder="Title shown"
          rows={2}
          // value={inputValues.questionnaireTitle || ''}
          inputRef={titleFldRef}
          variant="outlined"
        />
        <TextField
          id="questionnaireInstructionsToBeSaved"
          label="Instructions"
          margin="dense"
          multiline
          name="questionnaireInstructions"
          onChange={updateSaveButton}
          placeholder="Instructions for filling out questionnaire"
          rows={6}
          // value={inputValues.questionnaireInstructions || ''}
          inputRef={instructionsFldRef}
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
