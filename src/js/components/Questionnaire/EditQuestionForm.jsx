import { ContentCopy } from '@mui/icons-material';
import { Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'; // FormLabel, Radio, RadioGroup,
import { withStyles } from '@mui/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import makeRequestParams from '../../common/utils/requestParamsUtils';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';
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

// const QUESTION_FIELDS_IN_FORM = [
//   'answerType', 'fieldMappingRule',
//   'questionInstructions', 'questionText',
//   'requireAnswer', 'statusActive'];

const EditQuestionForm = ({ classes }) => {
  renderLog('EditQuestionForm');
  const {  getAppContextValue } = useConnectAppContext();

  const [question] = React.useState(getAppContextValue('selectedQuestion'));
  const [questionnaire] = React.useState(getAppContextValue('selectedQuestionnaire'));
  const [errorString, setErrorString] = React.useState('');
  const [answerTypeValue, setAnswerTypeValue] = React.useState('');
  const [fieldMappingRuleValue, setFieldMappingRuleValue] = React.useState('');
  const [questionInstructionsValue, setQuestionInstructionsValue] = React.useState('');
  const [questionTextValue, setQuestionTextValue] = React.useState('');
  const [requireAnswerValue, setRequireAnswerValue] = React.useState(false);
  const [statusActiveValue, setStatusActiveValue]  = React.useState(true);


  // eslint-disable-next-line no-unused-vars
  const [fieldMappingRuleCopied, setFieldMappingRuleCopied] = React.useState('');
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);
  const [showFieldMappingOptions, setShowFieldMappingOptions] = React.useState(false);

  const queryClient = useQueryClient();
  const answerTypeFldRef = useRef('');
  const fieldMappingRuleFldRef = useRef('');
  const questionInstructionsFldRef = useRef('');
  const questionTextFldRef = useRef('');
  const requireAnswerFldRef = useRef(false);
  const statusActiveFldRef = useRef(true);

  useEffect(() => {
    if (question) {
      setAnswerTypeValue(question.answerType);
      setFieldMappingRuleValue(question.fieldMappingRule);
      setQuestionInstructionsValue(question.questionInstructions);
      setQuestionTextValue(question.questionText);
      setRequireAnswerValue(question.requireAnswer);
      setStatusActiveValue(question.statusActive);
    } else {
      setAnswerTypeValue('');
      setFieldMappingRuleValue('');
      setQuestionInstructionsValue('');
      setQuestionTextValue('');
      setRequireAnswerValue(false);
      setStatusActiveValue(true);
    }
  }, [question]);

  const questionSaveMutation = useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('question-save', requestParams),
    onSuccess: () => {
      // console.log('--------- questionSaveMutation mutated ---------');
      queryClient.invalidateQueries('question-list-retrieve').then(() => {});
    },
  });

  // eslint-disable-next-line no-unused-vars
  const copyFieldMappingRule = (fieldMappingRule) => {
  //   // console.log('EditQuestionForm copyFieldMappingRule');
  //   // openSnackbar({ message: 'Copied!' });
  //   setFieldMappingRuleCopied(fieldMappingRule);
  //   setInputValues({ ...inputValues, ['fieldMappingRule']: fieldMappingRule });
  //   // Hack 1/14/25 to get compile
  //   // AppObservableStore.setGlobalVariableState('fieldMappingRuleChanged', true);
  //   // AppObservableStore.setGlobalVariableState('fieldMappingRuleToBeSaved', fieldMappingRule);
  //   // End Hack 1/14/25 to get compile
  //   setSaveButtonActive(true);
  //   setTimeout(() => {
  //     setFieldMappingRuleCopied('');
  //   }, 1500);
  };

  const saveQuestion = () => {
    const types = ['INTEGER', 'BOOLEAN', 'STRING'];
    if (!types.includes(answerTypeFldRef.current.value.trim())) {
      setErrorString('type must be one of [INTEGER, BOOLEAN, STRING]');
      setSaveButtonActive(true);
    } else {
      const requestParams = makeRequestParams({
        questionId: question ? question.id : '-1',
        questionnaireId: questionnaire.id,
      }, {
        answerType: answerTypeFldRef.current.value,
        // fieldMappingRule: fieldMappingRuleFldRef.current.checked,
        questionInstructions: questionInstructionsFldRef.current.value,
        questionText: questionTextFldRef.current.value,
        requireAnswer: (requireAnswerFldRef.current.value === 'on'),
        statusActive: (statusActiveFldRef.current.value === 'on'),
      });
      questionSaveMutation.mutate(requestParams);
      console.log('saveQuestionnaire requestParams:', requestParams);
      setSaveButtonActive(false);
    }
  };

  const updateSaveButton = () => {
    if (questionTextFldRef.current.value && questionTextFldRef.current.value.length &&
      questionInstructionsFldRef.current.value && questionInstructionsFldRef.current.value.length &&
      questionInstructionsFldRef.current.value && questionInstructionsFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  return (
    <EditQuestionFormWrapper>
      {errorString}
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={questionTextValue}
          id="questionTextToBeSaved"
          inputRef={questionTextFldRef}
          label="Question"
          margin="dense"
          multiline
          name="questionText"
          onChange={() => updateSaveButton()}
          placeholder="Question you are asking"
          rows={6}
          variant="outlined"
        />
        <TextField
          defaultValue={questionInstructionsValue}
          id="questionInstructionsToBeSaved"
          inputRef={questionInstructionsFldRef}
          label="Special Instructions"
          margin="dense"
          multiline
          name="questionInstructions"
          onChange={() => updateSaveButton()}
          placeholder="Instructions to clarify the question"
          rows={4}
          variant="outlined"
        />
        {/* If this is a one of 3 choices field, it probably should be a pull down menu chooser */}
        <TextField
          defaultValue={answerTypeValue}
          id="answerTypeToBeSaved"
          inputRef={answerTypeFldRef}
          label="Type of Answer"
          margin="dense"
          name="answerType"
          onChange={() => updateSaveButton()}
          placeholder="BOOLEAN / INTEGER / STRING"
          variant="outlined"
        />
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              checked={Boolean(requireAnswerValue)}
              className={classes.checkboxRoot}
              color="primary"
              id="requireAnswerToBeSaved"
              inputRef={requireAnswerFldRef}
              name="requireAnswer"
              onChange={() => updateSaveButton()}
            />
          )}
          label="Require an answer to this question"
        />
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              id="statusActiveToBeSaved"
              inputRef={statusActiveFldRef}
              checked={Boolean(statusActiveValue)}
              className={classes.checkboxRoot}
              color="primary"
              name="statusActive"
              onChange={() => updateSaveButton()}
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
            inputRef={fieldMappingRuleFldRef}
            label="Save answer to this database field"
            name="fieldMappingRule"
            margin="dense"
            variant="outlined"
            placeholder="ex/ Person.firstName"
            value={fieldMappingRuleValue}
            onChange={() => updateSaveButton()}
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
