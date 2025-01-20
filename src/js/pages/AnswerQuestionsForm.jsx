import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import QuestionnaireActions from '../actions/QuestionnaireActions';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';
import convertToInteger from '../common/utils/convertToInteger';
import { renderLog } from '../common/utils/logging';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';


const AnswerQuestionsForm = ({ classes, match }) => {
  renderLog('AnswerQuestionsForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [questionList] = useState([]);
  const [questionnaire] = useState({});
  // const [questionnaireCount, setQuestionnaireCount] = useState(0);
  // const [questionnaireId, setQuestionnaireId] = useState(-1);
  const [saveButtonActive, setSaveButtonActive] = useState(false);
  const [inputValues, setInputValues] = useState({});

  //
  // const onQuestionnaireStoreChange = () => {
  //   const { params } = match;
  //   const questionnaireIdTemp = convertToInteger(params.questionnaireId);
  //   const questionnaireTemp = QuestionnaireStore.getQuestionnaireById(questionnaireIdTemp);
  //   setQuestionnaire(questionnaireTemp);
  //   const questionListTemp = QuestionnaireStore.getQuestionListByQuestionnaireId(questionnaireIdTemp);
  //   // console.log('AnswerQuestionsForm QuestionnaireStore.getQuestionList:', questionListTemp);
  //   setQuestionList(questionListTemp);
  //   setQuestionnaireCount(questionListTemp.length);
  // };

  const updateQuestionAnswer = (event) => {
    // The input name must match the person field being updated
    if (event.target.name) {
      const newValue = event.target.value || '';
      // console.log('updateQuestionAnswer:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updateQuestionAnswer Invalid event:', event);
    }
  };

  const saveAnswers = () => {
    const { params } = match;
    const personIdTemp = convertToInteger(params.personId);
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);

    console.log('saveAnswers inputValues:', inputValues);
    const data = { ...inputValues };
    // console.log('saveAnswers data:', data);
    QuestionnaireActions.questionnaireAnswerListSave(questionnaireIdTemp, personIdTemp, data);
    setSaveButtonActive(false);
  };

  // React.useEffect(() => {
  //   const { params } = match;
  //   const questionnaireIdTemp = convertToInteger(params.questionnaireId);
  //
  //   // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
  //   // onAppObservableStoreChange();
  //   // const questionnaireStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
  //   // onQuestionnaireStoreChange();
  //
  //   if (questionnaireIdTemp >= 0) {
  //     if (apiCalming('questionnaireListRetrieve', 10000)) {
  //       QuestionnaireActions.questionnaireListRetrieve();
  //     }
  //     if (apiCalming(`questionListRetrieve-${questionnaireIdTemp}`, 10000)) {
  //       QuestionnaireActions.questionListRetrieve(questionnaireIdTemp);
  //     }
  //   }
  //
  //   return () => {
  //     // appStateSubscription.unsubscribe();
  //     // questionnaireStoreListener.remove();
  //   };
  // }, []);

  // const { params } = match;
  // const questionnaireIdTemp = convertToInteger(params.questionnaireId);

  return (
    <div>
      <Helmet>
        <title>
          Questionnaire For You -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <meta name="robots" content="noindex" data-react-helmet="true" />
      </Helmet>
      <PageContentContainer>
        {questionnaire.questionnaireTitle && (
          <TitleWrapper>
            {questionnaire.questionnaireTitle}
          </TitleWrapper>
        )}
        {questionnaire.questionnaireInstructions && (
          <InstructionsWrapper>
            {questionnaire.questionnaireInstructions}
          </InstructionsWrapper>
        )}
        <FormControl classes={{ root: classes.formControl }}>
          {questionList.map((question) => (
            <OneQuestionWrapper key={`questionnaire-${question.id}`}>
              <QuestionText>
                {question.questionText}
                {question.requireAnswer && <RequiredStar> *</RequiredStar>}
              </QuestionText>
              {question.questionInstructions && (
                <QuestionInstructions>
                  {question.questionInstructions}
                </QuestionInstructions>
              )}
              <QuestionFormWrapper>
                <TextField
                  classes={(question.answerType === 'INTEGER') ? {} : { root: classes.formControl }}
                  id={`questionAnswerToBeSaved-${question.id}`}
                  // label={`${question.id}`}
                  name={`questionAnswer-${question.id}`}
                  margin="dense"
                  variant="outlined"
                  placeholder={question.questionPlaceholder || ''}
                  value={inputValues[`questionAnswer-${question.id}`] || ''}
                  onChange={updateQuestionAnswer}
                />
              </QuestionFormWrapper>
            </OneQuestionWrapper>
          ))}
          <SaveButtonWrapper>
            <Button
              classes={{ root: classes.saveAnswersButton }}
              color="primary"
              disabled={!saveButtonActive}
              variant="contained"
              onClick={saveAnswers}
            >
              Save Your Answers
            </Button>
          </SaveButtonWrapper>
        </FormControl>
      </PageContentContainer>
    </div>
  );
};
AnswerQuestionsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  formControl: {
    width: '100%',
  },
  saveAnswersButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
`;

const OneQuestionWrapper = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutralUI200};
  margin-top: 24px;
`;

const QuestionInstructions = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
`;

const QuestionFormWrapper = styled('div')`
  width: 100%;
`;

const QuestionText = styled('div')`
`;

const RequiredStar = styled('span')`
  color: ${DesignTokenColors.alert800};
  font-weight: bold;
`;

const SaveButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const TitleWrapper = styled('h1')`
  margin-bottom: 8px;
`;

export default withStyles(styles)(AnswerQuestionsForm);
