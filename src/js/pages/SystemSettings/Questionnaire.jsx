import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import webAppConfig from '../../config';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import convertToInteger from '../../common/utils/convertToInteger';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';


const Questionnaire = ({ classes, match }) => {
  renderLog('Questionnaire');  // Set LOG_RENDER_EVENTS to log all renders
  const [questionList, setQuestionList] = React.useState([]);
  const [questionnaire, setQuestionnaire] = React.useState({});
  // eslint-disable-next-line no-unused-vars
  const [questionnaireCount, setQuestionnaireCount] = React.useState(0);
  const { setAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes

  // const onAppObservableStoreChange = () => {
  // };

  const onQuestionnaireStoreChange = () => {
    const { params } = match;
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);
    const questionnaireTemp = QuestionnaireStore.getQuestionnaireById(questionnaireIdTemp);
    setQuestionnaire(questionnaireTemp);
    const questionListTemp = QuestionnaireStore.getQuestionListByQuestionnaireId(questionnaireIdTemp);
    // console.log('Questionnaire QuestionnaireStore.getQuestionList:', questionListTemp);
    setQuestionList(questionListTemp);
    setQuestionnaireCount(questionListTemp.length);
  };

  const addQuestionClick = () => {
    const { params } = match;
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);
    setAppContextValue('editQuestionDrawerOpen', true);
    setAppContextValue('editQuestionDrawerQuestionId', -1);
    setAppContextValue('editQuestionDrawerQuestionnaireId', questionnaireIdTemp);
  };

  const editQuestionClick = (questionId) => {
    const { params } = match;
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);
    setAppContextValue('editQuestionDrawerOpen', true);
    setAppContextValue('editQuestionDrawerQuestionId', questionId);
    setAppContextValue('editQuestionDrawerQuestionnaireId', questionnaireIdTemp);
  };

  const editQuestionnaireClick = () => {
    const { params } = match;
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('editQuestionnaireDrawerQuestionnaireId', questionnaireIdTemp);
  };

  React.useEffect(() => {
    const { params } = match;
    const questionnaireIdTemp = convertToInteger(params.questionnaireId);

    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const questionnaireStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();

    if (questionnaireIdTemp >= 0) {
      if (apiCalming('questionnaireListRetrieve', 1000)) {
        QuestionnaireActions.questionnaireListRetrieve();
      }
      if (apiCalming(`questionListRetrieve-${questionnaireIdTemp}`, 1000)) {
        QuestionnaireActions.questionListRetrieve(questionnaireIdTemp);
      }
    }

    return () => {
      // appStateSubscription.unsubscribe();
      questionnaireStoreListener.remove();
    };
  }, []);

  const { params } = match;
  const questionnaireIdTemp = convertToInteger(params.questionnaireId);

  return (
    <div>
      <Helmet>
        <title>
          Questionnaire Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/questionnaire-question-list/${questionnaireIdTemp}`} />
      </Helmet>
      <PageContentContainer>
        <div>
          <Link to="/system-settings">Questionnaires</Link>
          {' '}
          &gt;
          {' '}
          {questionnaire.questionnaireName}
          <SpanWithLinkStyle onClick={editQuestionnaireClick}>
            <EditStyled />
          </SpanWithLinkStyle>
        </div>
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
        <QuestionListWrapper>
          {questionList.map((question) => (
            <OneQuestionnaireWrapper key={`questionnaire-${question.id}`}>
              {question.questionText}
              {' '}
              {question.requireAnswer && (
                <RequiredStar> *</RequiredStar>
              )}
              <SpanWithLinkStyle onClick={() => editQuestionClick(question.id)}>
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
    </div>
  );
};
Questionnaire.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
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
