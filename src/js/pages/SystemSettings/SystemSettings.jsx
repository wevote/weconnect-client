import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Edit } from '@mui/icons-material';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import { useWeAppContext } from '../../contexts/WeAppContext';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


const SystemSettings = ({ classes }) => {
  renderLog('SystemSettings');  // Set LOG_RENDER_EVENTS to log all renders
  const [questionnaireList, setQuestionnaireList] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [questionnaireCount, setQuestionnaireCount] = React.useState(0);
  const { setAppContextValue } = useWeAppContext();  // This component will re-render whenever the value of WeAppContext changes

  // const onAppObservableStoreChange = () => {
  // };

  const onQuestionnaireStoreChange = () => {
    const questionnaireListTemp = QuestionnaireStore.getAllCachedQuestionnairesList();
    // console.log('SystemSettings QuestionnaireStore.getQuestionnaireList:', questionnaireListTemp);
    setQuestionnaireList(questionnaireListTemp);
    setQuestionnaireCount(questionnaireListTemp.length);
    if (apiCalming('questionnaireListRetrieve', 1000)) {
      QuestionnaireActions.questionnaireListRetrieve();
    }
  };

  const addQuestionnaireClick = () => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('editQuestionnaireDrawerQuestionnaireId', -1);
  };

  const editQuestionnaireClick = (questionnaireId) => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('editQuestionnaireDrawerQuestionnaireId', questionnaireId);
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();

    if (apiCalming('questionnaireListRetrieve', 1000)) {
      QuestionnaireActions.questionnaireListRetrieve();
    }

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          System Settings -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/system-settings`} />
      </Helmet>
      <PageContentContainer>
        <div>
          System Settings -
          {' '}
          <Link to="/">home</Link>
        </div>
        {questionnaireList.map((questionnaire) => (
          <OneQuestionnaireWrapper key={`questionnaire-${questionnaire.id}`}>
            <QuestionnaireInnerWrapper>
              <Link to={`/questionnaire/${questionnaire.id}`}>
                {questionnaire.questionnaireName}
              </Link>
              <EditQuestionnaire onClick={() => editQuestionnaireClick(questionnaire.questionnaireId)}>
                <EditStyled />
              </EditQuestionnaire>
            </QuestionnaireInnerWrapper>
          </OneQuestionnaireWrapper>
        ))}
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addQuestionnaireButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addQuestionnaireClick}
          >
            Add Questionnaire
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </div>
  );
};
SystemSettings.propTypes = {
  classes: PropTypes.object.isRequired,
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

const EditQuestionnaire = styled('div')`
`;

const EditStyled = styled(Edit)`
  color: ${DesignTokenColors.neutral100};
  height: 16px;
  margin-left: 2px;
  width: 16px;
`;

const OneQuestionnaireWrapper = styled('div')`
`;

const QuestionnaireInnerWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 6px;
`;

export default withStyles(styles)(SystemSettings);
