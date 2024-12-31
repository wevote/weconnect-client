import { FormControl, TextField } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import PersonActions from '../actions/PersonActions';
import PersonStore from '../stores/PersonStore';
import QuestionnaireActions from '../actions/QuestionnaireActions';
import QuestionnaireStore from '../stores/QuestionnaireStore';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';
import apiCalming from '../common/utils/apiCalming';
import { renderLog } from '../common/utils/logging';
import convertToInteger from '../common/utils/convertToInteger';
import getAnswerValueFromAnswerDict from '../utils/getAnswerValueFromAnswerDict';


const QuestionnaireAnswers = ({ classes, match }) => {
  renderLog('QuestionnaireAnswers');  // Set LOG_RENDER_EVENTS to log all renders
  const [allCachedAnswersDict, setAllCachedAnswersDict] = React.useState({});
  const [fullNamePreferred, setFullNamePreferred] = React.useState('');
  const [questionList, setQuestionList] = React.useState([]);
  const [questionnaire, setQuestionnaire] = React.useState({});

  const onPersonStoreChange = () => {
    const { params } = match;
    const personIdTemp = convertToInteger(params.personId);
    const fullNamePreferredTemp = PersonStore.getFullNamePreferred(personIdTemp);
    setFullNamePreferred(fullNamePreferredTemp);
    // console.log('QuestionnaireAnswers-onPersonStoreChange personIdTemp: ', personIdTemp, ', fullNamePreferredTemp:', fullNamePreferredTemp);
  };

  const onQuestionnaireStoreChange = () => {
    const { params } = match;
    const personIdTemp = convertToInteger(params.personId);
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);
    const questionnaireTemp = QuestionnaireStore.getQuestionnaireById(questionnaireIdTemp);
    setQuestionnaire(questionnaireTemp);
    const questionListTemp = QuestionnaireStore.getQuestionListByQuestionnaireId(questionnaireIdTemp);
    // console.log('QuestionnaireAnswers QuestionnaireStore.getQuestionList:', questionListTemp);
    setQuestionList(questionListTemp);
    const allCachedAnswersDictTemp = QuestionnaireStore.getAllCachedAnswersDictByPersonId(personIdTemp);
    setAllCachedAnswersDict(allCachedAnswersDictTemp);
  };

  const getAnswerValue = (questionId) => {
    if (allCachedAnswersDict && allCachedAnswersDict[questionId]) {
      const questionAnswer = allCachedAnswersDict[questionId];
      return getAnswerValueFromAnswerDict(questionAnswer);
    }
    return '';
  };

  React.useEffect(() => {
    const { params } = match;
    const personIdTemp = convertToInteger(params.personId);
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);

    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const questionnaireStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();

    if (questionnaireIdTemp >= 0) {
      if (apiCalming('questionnaireListRetrieve', 10000)) {
        QuestionnaireActions.questionnaireListRetrieve();
      }
      if (apiCalming(`questionListRetrieve-${questionnaireIdTemp}`, 10000)) {
        QuestionnaireActions.questionListRetrieve(questionnaireIdTemp);
      }
    }
    if (personIdTemp >= 0) {
      if (apiCalming(`personRetrieve-${personIdTemp}`, 30000)) {
        PersonActions.personRetrieve(personIdTemp);
      }
      const personIdList = [personIdTemp];
      if (apiCalming(`questionnaireResponsesListRetrieve-${personIdTemp}`, 10000)) {
        QuestionnaireActions.questionnaireResponsesListRetrieve(personIdList);
      }
    }

    return () => {
      personStoreListener.remove();
      questionnaireStoreListener.remove();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          Questionnaire Answers -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <meta name="robots" content="noindex" data-react-helmet="true" />
      </Helmet>
      <PageContentContainer>
        {questionnaire.questionnaireName && (
          <TitleWrapper>
            {questionnaire.questionnaireName}
          </TitleWrapper>
        )}
        <AnsweredBy>
          Answered by:
          {' '}
          <AnsweredBySpan>{fullNamePreferred}</AnsweredBySpan>
        </AnsweredBy>
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
                  name={`questionAnswer-${question.id}`}
                  margin="dense"
                  variant="outlined"
                  placeholder={question.questionPlaceholder || ''}
                  value={getAnswerValue(question.id)}
                />
              </QuestionFormWrapper>
            </OneQuestionWrapper>
          ))}
        </FormControl>
      </PageContentContainer>
    </div>
  );
};
QuestionnaireAnswers.propTypes = {
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

const AnsweredBy = styled('div')`
  font-size: 1.3em;
  font-weight: 300;
`;

const AnsweredBySpan = styled('span')`
  font-weight: bold;
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

const TitleWrapper = styled('h1')`
  margin-bottom: 8px;
`;

export default withStyles(styles)(QuestionnaireAnswers);
