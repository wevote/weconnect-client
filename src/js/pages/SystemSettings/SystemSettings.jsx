import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { renderLog } from '../../common/utils/logging';
import useFetchData from '../../react-query/fetchData';


const SystemSettings = ({ classes }) => {
  renderLog('SystemSettings');
  const { setAppContextValue } = useConnectAppContext();

  // eslint-disable-next-line no-unused-vars
  const [questionnaireList, setQuestionnaireList] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [taskGroupList, setTaskGroupList] = React.useState([]);




  const { data: dataQList, isSuccess: isSuccessQList, isFetching: isFetchingQList } = useFetchData(['questionnaire-list-retrieve'], {});
  console.log('useFetchData in SystemSettings:', dataQList, isSuccessQList, isFetchingQList);
  if (isFetchingQList) {
    console.log('isFetching  ------------');
  }
  useEffect(() => {
    console.log('useFetchData in SystemSettings useEffect:', dataQList, isSuccessQList, isFetchingQList);
    if (dataQList !== undefined && isFetchingQList === false) {
      console.log('useFetchData in SystemSettings useEffect data is good:', dataQList, isSuccessQList, isFetchingQList);
      console.log('Successfully retrieved questionnaire-list-retrieve...');
      const questionnaireListTemp = dataQList.questionnaireList;
      setQuestionnaireList(questionnaireListTemp);
    }
  }, [dataQList]);


  /* Hack 1/14/25 to get compile
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
*/

  const addQuestionnaireClick = () => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('editQuestionnaireDrawerQuestionnaireId', -1);
  };

  const editQuestionnaireClick = (questionnaireId) => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('editQuestionnaireDrawerQuestionnaireId', questionnaireId);
  };

  const addTaskGroupClick = () => {
    // Hack 1/14/25 to get compile
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', -1);
  };

  // eslint-disable-next-line no-unused-vars
  const editTaskGroupClick = (taskGroupId) => {
    // Hack 1/14/25 to get compile
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', taskGroupId);
  };

/* eslint-disable indent */
//   React.useEffect(() => {
// <<<<<<< HEAD
//     // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
//     // onAppObservableStoreChange();
//     const personStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
// =======
//     const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
//     onAppObservableStoreChange();
//     const questionnaireStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
// >>>>>>> upstream/develop
//     onQuestionnaireStoreChange();
//     const taskStoreListener = TaskStore.addListener(onTaskStoreChange);
//     onTaskStoreChange();
//
//     if (apiCalming('questionnaireListRetrieve', 1000)) {
//       QuestionnaireActions.questionnaireListRetrieve();
//     }
//     if (apiCalming('taskGroupListRetrieve', 1000)) {
//       TaskActions.taskGroupListRetrieve();
//     }
//
//     return () => {
// <<<<<<< HEAD
//       // appStateSubscription.unsubscribe();
//       personStoreListener.remove();
// =======
//       appStateSubscription.unsubscribe();
//       questionnaireStoreListener.remove();
//       taskStoreListener.remove();
// >>>>>>> upstream/develop
// End Hack 1/14/25 to get compile

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
              {/* Hack 1/14/25 to get compile */}
              {/* <Link to={`/questionnaire/${questionnaire.id}`}> */}
              {/*  {questionnaire.questionnaireName} */}
              {/* </Link> */}
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
              {/* Hack 1/14/25 to get compile */}
              {/* <Link to={`/task-group/${taskGroup.id}`}> */}
              {/*  {taskGroup.taskGroupName} */}
              {/* </Link> */}
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
