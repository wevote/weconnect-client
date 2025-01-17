import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import useFetchData from '../../react-query/fetchData';


// eslint-disable-next-line no-unused-vars
const Questionnaire = ({ classes, match }) => {
  renderLog('Questionnaire');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();

  const dummy = {
    questionnaireName: '---',
    questionnaireTitle: '---',
    questionnaireInstructions: 'Dev note: There is enough info in the URL to handle the edge case of the bookmarking this page, or hard refreshing while on this page... someday...',
  };
  const [questionList, setQuestionList] = React.useState([]);
  const [questionnaire] = React.useState(getAppContextValue('selectedQuestionnaire') || dummy);
  // eslint-disable-next-line no-unused-vars
  const [questionnaireList, setQuestionnaireList] = React.useState([]);

  const { data: dataQList, isSuccess: isSuccessQList, isFetching: isFetchingQList } = useFetchData(['questionnaire-list-retrieve'], {});
  useEffect(() => {
    console.log('useFetchData in Questionnaire useEffect:', dataQList, isSuccessQList, isFetchingQList);
    if (dataQList !== undefined && isFetchingQList === false && questionnaire) {
      console.log('useFetchData in Questionnaire useEffect data is good:', dataQList, isSuccessQList, isFetchingQList);
      console.log('Successfully retrieved questionnaire-list-retrieve...');
      const questionnaireListTemp = dataQList.questionnaireList;
      setQuestionnaireList(questionnaireListTemp);
    }
  }, [dataQList, questionnaire]);

  const { data: dataQuestionList, isSuccess: isSuccessQuestionList, isFetching: isFetchingQuestionList } =
    useFetchData(['question-list-retrieve'], { questionnaireId: questionnaire ? questionnaire.questionnaireId : '-1'});
  useEffect(() => {
    console.log('useFetchData question-list-retrieve in Questionnaire useEffect:', dataQuestionList, isSuccessQuestionList, isFetchingQuestionList);
    if (dataQuestionList !== undefined && isFetchingQuestionList === false) {
      console.log('useFetchData question-list-retrieve in Questionnaire useEffect data is good:', dataQuestionList, isSuccessQuestionList, isFetchingQuestionList);
      const questionListTemp = dataQuestionList.questionList;
      console.log('Successfully retrieved question-list-retrieve... questionListTemp', questionListTemp);
      // const questionsForThisQuestionnaire = questionListTemp.filter((question) => question.questionnaireId !== questionnaire.questionnaireId);
      // console.log('questionsForThisQuestionnaire: ', questionsForThisQuestionnaire);
      setQuestionList(questionListTemp);
    }
  }, [dataQuestionList]);

  const addQuestionClick = () => {
    setAppContextValue('editQuestionDrawerOpen', true);
    setAppContextValue('selectedQuestion', undefined);
  };

  const editQuestionClick = (question) => {
    setAppContextValue('editQuestionDrawerOpen', true);
    setAppContextValue('selectedQuestion', question);
  };

  const editQuestionnaireClick = () => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
  };

  return (
    <>
      <Helmet>
        <title>
          Questionnaire Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/questionnaire-question-list/${questionnaireIdTemp}`} /> */}
      </Helmet>
      <PageContentContainer>
        <QuestionnaireTitleWrapper>
          <Link to="/system-settings" style={{ height: '40px', fontSize: 'large' }} className="u-cursor--pointer u-link-color">
            Questionnaires
          </Link>
          {' '}
          &gt;
          {' '}
          {questionnaire.questionnaireName}
          <SpanWithLinkStyle onClick={editQuestionnaireClick}>
            <EditStyled />
          </SpanWithLinkStyle>
        </QuestionnaireTitleWrapper>
        {questionnaire.questionnaireTitle && (
          <TitleWrapper>
            Questionnaire Name: {questionnaire.questionnaireName}
            <br />
            Questionnaire Title: {questionnaire.questionnaireTitle}
          </TitleWrapper>
        )}
        {questionnaire.questionnaireInstructions && (
          <InstructionsWrapper>
            {questionnaire.questionnaireInstructions}
          </InstructionsWrapper>
        )}
        <QuestionListWrapper>
          {questionList.map((question) => (
            <OneQuestionnaireWrapper key={`questionnaire-${question.id}`}>
              {console.log('questionList.map((questionnaire)', questionList)}
              Question: {question.questionText}
              {' '}
              {question.requireAnswer && (
                <RequiredStar> *</RequiredStar>
              )}
              <SpanWithLinkStyle onClick={() => editQuestionClick(question)}>
                <EditStyled />
              </SpanWithLinkStyle>
            </OneQuestionnaireWrapper>
          ))}
        </QuestionListWrapper>
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addQuestionnaireButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addQuestionClick}
          >
            Add Question
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </>
  );
};
Questionnaire.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addQuestionnaireButtonRoot: {
    width: 185,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AddButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const EditStyled = styled(Edit)`
  color: ${DesignTokenColors.neutral100};
  height: 16px;
  margin-left: 2px;
  width: 16px;
`;

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
`;

const QuestionnaireTitleWrapper = styled('div')`
  height: 100px;
  align-content: center;
`;
const OneQuestionnaireWrapper = styled('div')`
  margin-bottom: 20px;
`;

const QuestionListWrapper = styled('div')`
  margin-top: 24px;
  padding-bottom: 24px;
`;

const RequiredStar = styled('span')`
  color: ${DesignTokenColors.alert800};
  font-weight: bold;
`;

const TitleWrapper = styled('h1')`
  line-height: 1.1;
  margin-bottom: 8px;
`;

export default withStyles(styles)(Questionnaire);
