import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import TaskActions from '../../actions/TaskActions';
import TaskStore from '../../stores/TaskStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';


const SystemSettings = ({ classes }) => {
  renderLog('SystemSettings');  // Set LOG_RENDER_EVENTS to log all renders
  const [questionnaireList, setQuestionnaireList] = React.useState([]);
  const [taskGroupList, setTaskGroupList] = React.useState([]);

  const onAppObservableStoreChange = () => {
  };

  const onQuestionnaireStoreChange = () => {
    const questionnaireListTemp = QuestionnaireStore.getAllCachedQuestionnairesList();
    // console.log('SystemSettings QuestionnaireStore.getQuestionnaireList:', questionnaireListTemp);
    setQuestionnaireList(questionnaireListTemp);
    if (apiCalming('questionnaireListRetrieve', 1000)) {
      QuestionnaireActions.questionnaireListRetrieve();
    }
  };

  const onTaskStoreChange = () => {
    const taskGroupListTemp = TaskStore.getAllCachedTaskGroupList();
    // console.log('SystemSettings TaskStore.getTaskGroupList:', taskGroupListTemp);
    setTaskGroupList(taskGroupListTemp);
    // setTaskGroupCount(taskGroupListTemp.length);
    if (apiCalming('taskGroupListRetrieve', 1000)) {
      TaskActions.taskGroupListRetrieve();
    }
  };

  const addQuestionnaireClick = () => {
    AppObservableStore.setGlobalVariableState('editQuestionnaireDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editQuestionnaireDrawerQuestionnaireId', -1);
  };

  const editQuestionnaireClick = (questionnaireId) => {
    AppObservableStore.setGlobalVariableState('editQuestionnaireDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editQuestionnaireDrawerQuestionnaireId', questionnaireId);
  };

  const addTaskGroupClick = () => {
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', -1);
  };

  const editTaskGroupClick = (taskGroupId) => {
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', taskGroupId);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const questionnaireStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();
    const taskStoreListener = TaskStore.addListener(onTaskStoreChange);
    onTaskStoreChange();

    if (apiCalming('questionnaireListRetrieve', 1000)) {
      QuestionnaireActions.questionnaireListRetrieve();
    }
    if (apiCalming('taskGroupListRetrieve', 1000)) {
      TaskActions.taskGroupListRetrieve();
    }

    return () => {
      appStateSubscription.unsubscribe();
      questionnaireStoreListener.remove();
      taskStoreListener.remove();
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
        <h1>
          System Settings
        </h1>
        {/* ****  **** */}
        <SettingsSubtitle>Questionnaires</SettingsSubtitle>
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
        {/* ****  **** */}
        <SettingsSubtitle>Onboarding Task Groupings</SettingsSubtitle>
        {taskGroupList.map((taskGroup) => (
          <OneQuestionnaireWrapper key={`taskGroup-${taskGroup.id}`}>
            <QuestionnaireInnerWrapper>
              <Link to={`/task-group/${taskGroup.id}`}>
                {taskGroup.taskGroupName}
              </Link>
              <EditQuestionnaire onClick={() => editTaskGroupClick(taskGroup.taskGroupId)}>
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
            onClick={addTaskGroupClick}
          >
            Add Task Grouping
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

const SettingsSubtitle = styled('h2')`
`;

export default withStyles(styles)(SystemSettings);
