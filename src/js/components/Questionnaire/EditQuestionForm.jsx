import { ContentCopy } from '@mui/icons-material';
import { Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'; // FormLabel, Radio, RadioGroup,
import { withStyles } from '@mui/styles';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import { renderLog } from '../../common/utils/logging';
import prepareDataPackageFromAppObservableStore from '../../common/utils/prepareDataPackageFromAppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { SpanWithLinkStyle } from '../Style/linkStyles';

const PERSON_FIELDS_ACCEPTED = [
  'firstName',
  'firstNamePreferred',
  'emailPersonal',
  'hoursPerWeekEstimate',
  'jobTitle',
  'lastName',
  'location',
  'stateCode',
  'zipCode',
];

const QUESTION_FIELDS_IN_FORM = [
  'answerType', 'fieldMappingRule',
  'questionInstructions', 'questionText',
  'requireAnswer', 'statusActive'];

const EditQuestionForm = ({ classes }) => {  //  classes, teamId
  renderLog('EditQuestionForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [fieldMappingRuleCopied, setFieldMappingRuleCopied] = React.useState('');
  const [firstQuestionDataReceived, setFirstQuestionDataReceived] = React.useState(false);
  const [inputValues, setInputValues] = React.useState({
    answerType: '',
    fieldMappingRule: '',
    questionInstructions: '',
    questionText: '',
    requireAnswer: false,
    statusActive: true,
  });
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);
  const [showFieldMappingOptions, setShowFieldMappingOptions] = React.useState(false);

  // const noNotch = {
  //   '& .MuiOutlinedInput-notchedOutline legend': {
  //     display: 'none',
  //   },
  // };

  const clearEditFormValuesInAppObservableStore = () => {
    const globalVariableStates = {};
    for (let i = 0; i < QUESTION_FIELDS_IN_FORM.length; i++) {
      const fieldName = QUESTION_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editQuestionDrawerQuestionId = -1;
    // console.log('clearEditFormValuesInAppObservableStore globalVariableStates:', globalVariableStates);
    AppObservableStore.setGlobalVariableStateInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstQuestionDataReceived(false);
    // setQuestionId(-1);
    clearEditFormValuesInAppObservableStore();
    AppObservableStore.setGlobalVariableState('editQuestionDrawerOpen', false);
  };

  const copyFieldMappingRule = (fieldMappingRule) => {
    // console.log('EditQuestionForm copyFieldMappingRule');
    // openSnackbar({ message: 'Copied!' });
    setFieldMappingRuleCopied(fieldMappingRule);
    setInputValues({ ...inputValues, ['fieldMappingRule']: fieldMappingRule });
    AppObservableStore.setGlobalVariableState('fieldMappingRuleChanged', true);
    AppObservableStore.setGlobalVariableState('fieldMappingRuleToBeSaved', fieldMappingRule);
    setSaveButtonActive(true);
    setTimeout(() => {
      setFieldMappingRuleCopied('');
    }, 1500);
  };

  const updateInputValuesFromQuestionnaireStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const questionIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionId');
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

  const onAppObservableStoreChange = () => {
    const editQuestionDrawerOpenTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerOpen');
    const questionIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionId');
    if (questionIdTemp >= 0 && !editQuestionDrawerOpenTemp) {
      clearEditedValues();
    }
  };

  const onQuestionnaireStoreChange = () => {
    const questionIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionId');
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
    const questionIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionId');
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionnaireId');
    const data = prepareDataPackageFromAppObservableStore(QUESTION_FIELDS_IN_FORM);
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
      AppObservableStore.setGlobalVariableState(`${event.target.name}Changed`, true);
      AppObservableStore.setGlobalVariableState(`${event.target.name}ToBeSaved`, newValue);
      // console.log('updateQuestionField:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updateQuestionField Invalid event:', event);
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
          placeholder="BOOLEAN / INTEGER / STRING"
          value={inputValues.answerType || ''}
          onChange={updateQuestionField}
        />
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              id="requireAnswerToBeSaved"
              checked={Boolean(inputValues.requireAnswer)}
              className={classes.checkboxRoot}
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
              className={classes.checkboxRoot}
              color="primary"
              name="statusActive"
              onChange={updateQuestionField}
            />
          )}
          label="Question is active"
        />
        <ShowMappingOptions>
          <div>
            {showFieldMappingOptions ? (
              <SpanWithLinkStyle onClick={() => setShowFieldMappingOptions(false)}>hide field mapping options</SpanWithLinkStyle>
            ) : (
              <SpanWithLinkStyle onClick={() => setShowFieldMappingOptions(true)}>show field mapping options</SpanWithLinkStyle>
            )}
          </div>
        </ShowMappingOptions>
        {showFieldMappingOptions && (
          <TextField
            id="fieldMappingRuleToBeSaved"
            label="Save answer to this database field"
            name="fieldMappingRule"
            margin="dense"
            variant="outlined"
            placeholder="ex/ Person.firstName"
            value={inputValues.fieldMappingRule || ''}
            onChange={updateQuestionField}
          />
        )}
        {showFieldMappingOptions && (
          <FieldMappingOptions>
            {PERSON_FIELDS_ACCEPTED.map((fieldName) => (
              <OneFieldMappingOption key={`option-${fieldName}`}>
                <CopyToClipboard text={`Person.${fieldName}`} onCopy={() => copyFieldMappingRule(`Person.${fieldName}`)}>
                  <OneFieldMappingOption>
                    Person.
                    {fieldName}
                    <ContentCopyStyled />
                  </OneFieldMappingOption>
                </CopyToClipboard>
                {fieldMappingRuleCopied === `Person.${fieldName}` && <>&nbsp;Copied!</>}
              </OneFieldMappingOption>
            ))}
          </FieldMappingOptions>
        )}
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

const ShowMappingOptions = styled('div')`
  margin-bottom: 10px;
  margin-top: 5px;
`;

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 0 !important;
`;

const ContentCopyStyled = styled(ContentCopy)`
  color: ${DesignTokenColors.neutral300};
  height: 16px;
  margin-left: 4px;
  width: 16px;
`;

const EditQuestionFormWrapper = styled('div')`
`;

const FieldMappingOptions = styled('div')`
  margin-bottom: 16px;
`;

const OneFieldMappingOption = styled('div')`
  align-items: center;
  color: ${DesignTokenColors.neutral300};
  display: flex;
`;

export default withStyles(styles)(EditQuestionForm);
