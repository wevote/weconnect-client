import { FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';
import { renderLog } from '../common/utils/logging';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';
import useFetchData from '../react-query/fetchData';


// eslint-disable-next-line no-unused-vars
const QuestionnaireAnswers = ({ classes, match }) => {
  renderLog('QuestionnaireAnswers');  // Set LOG_RENDER_EVENTS to log all renders
  const [questionnaireId] = useState(parseInt(useParams().questionnaireId));
  const [personId] = useState(parseInt(useParams().personId));
  const [person, setPerson] = useState(undefined);
  const [questionList, setQuestionList] = useState(undefined);
  const [questionnaire] = useState({});

  const { data: dataQL, isSuccess: isSuccessQL, isFetching: isFetchingQL } = useFetchData(['question-list-retrieve'], {});
  useEffect(() => {
    console.log('useFetchData in QuestionnaireAnswers (question-list-retrieve) useEffect:', dataQL, isSuccessQL);
    if (isSuccessQL) {
      setQuestionList(dataQL ? dataQL.questionList : undefined);
    }
  }, [dataQL, isSuccessQL, isFetchingQL]);

  const { data: dataPerson, isSuccess: isSuccessPerson, isFetching: isFetchingPerson } = useFetchData(['person-retrieve'], { personId });
  useEffect(() => {
    console.log('useFetchData in QuestionnaireAnswers (person-retrieve) useEffect:', dataPerson, isSuccessPerson);
    if (isSuccessPerson) {
      setPerson(dataPerson);  // hack
    }
  }, [dataPerson, isSuccessPerson, isFetchingPerson]);

  const { data: dataQuestionList, isSuccess: isSuccessQuestionList, isFetching: isFetchingQuestionList } =
    useFetchData(['question-list-retrieve'], { questionnaireId });
  useEffect(() => {
    console.log('useFetchData question-list-retrieve in QuestionnaireAnswers useEffect:', dataQuestionList, isSuccessQuestionList, isFetchingQuestionList);
    if (dataQuestionList !== undefined && isFetchingQuestionList === false) {
      console.log('useFetchData question-list-retrieve in QuestionnaireAnswers useEffect data is good:', dataQuestionList, isSuccessQuestionList, isFetchingQuestionList);
      const questionListTemp = dataQuestionList.questionList;
      console.log('Successfully retrieved question-list-retrieve... questionListTemp', questionListTemp);
      setQuestionList(dataQuestionList.questionList);
    }
  }, [dataQuestionList, isFetchingQuestionList]);

  /* eslint-disable arrow-body-style */
  // eslint-disable-next-line no-unused-vars
  const getAnswerValue = (questionId) => {
    // if (allCachedAnswersDict && allCachedAnswersDict[questionId]) {
    //   const questionAnswer = allCachedAnswersDict[questionId];
    //   return getAnswerValueFromAnswerDict(questionAnswer);
    // }
    return '';
  };

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
          <AnsweredBySpan>{person ? `${person.firstName} ${person.lastName}` : 'tbd'}</AnsweredBySpan>
        </AnsweredBy>
        <FormControl classes={{ root: classes.formControl }}>
          {questionList && questionList.map((question) => (
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
  height: 100px;
  align-content: center;
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
