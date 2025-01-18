import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import useFetchData from '../../react-query/fetchData';


// eslint-disable-next-line no-unused-vars
const TaskGroup = ({ classes, match }) => {
  renderLog('TaskGroup');
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();


  const [taskGroupId] = React.useState(parseInt(useParams().taskGroupId));
  const [taskGroup, setTaskGroup] = React.useState({});

  // eslint-disable-next-line no-unused-vars
  const [taskGroupCount, setTaskGroupCount] = React.useState(0);
  const [taskDefinitionList, setTaskDefinitionList] = React.useState(undefined);


  const { data: dataTDL, isSuccess: isSuccessTDL, isFetching: isFetchingTDL } = useFetchData(['task-definition-list-retrieve'], {taskGroupId});
  useEffect(() => {
    if (isSuccessTDL) {
      console.log('useFetchData in TeamHome (task-definition-list-retrieve) useEffect data good:', dataTDL);
      setTaskDefinitionList(dataTDL ? dataTDL.taskDefinitionList : []);
    }
  }, [dataTDL, isSuccessTDL, isFetchingTDL]);

  const { data: dataTG, isSuccess: isSuccessTG, isFetching: isFetchingTG } = useFetchData(['task-group-retrieve'], {taskGroupId});
  useEffect(() => {
    if (isSuccessTG) {
      console.log('useFetchData in TeamHome (task-group-retrieve) useEffect data good:', dataTG);
      setTaskGroup(dataTG ? dataTG : []);
    }
  }, [dataTG, isSuccessTG, isFetchingTG]);


  const addTaskDefinitionClick = () => {
    // const { params } = match;
    // const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    setAppContextValue('editTaskDefinitionDrawerOpen', true);
    setAppContextValue('editTaskDefinitionDrawerTaskDefinitionId', -1);
    setAppContextValue('editTaskDefinitionDrawerTaskGroupId', taskGroupId);
  };

  // eslint-disable-next-line no-unused-vars
  const editTaskDefinitionClick = (taskDefinitionId) => {
    // const { params } = match;
    // const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    // AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerOpen', true);
    // AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId', taskDefinitionId);
    // AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerTaskGroupId', taskGroupIdTemp);
  };

  const editTaskGroupClick = () => {
    // const { params } = match;
    // const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', taskGroupIdTemp);
  };

  // React.useEffect(() => {
  //   const { params } = match;
  //   const taskGroupIdTemp = convertToInteger(params.taskGroupId);
  //
  //   const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
  //   onAppObservableStoreChange();
  //   const taskGroupStoreListener = TaskStore.addListener(onTaskStoreChange);
  //   onTaskStoreChange();
  //
  //   if (taskGroupIdTemp >= 0) {
  //     if (apiCalming('taskGroupListRetrieve', 1000)) {
  //       TaskActions.taskGroupListRetrieve();
  //     }
  //     if (apiCalming(`taskDefinitionListRetrieve-${taskGroupIdTemp}`, 1000)) {
  //       TaskActions.taskDefinitionListRetrieve(taskGroupIdTemp);
  //     }
  //   }
  //
  //   return () => {
  //     appStateSubscription.unsubscribe();
  //     taskGroupStoreListener.remove();
  //   };
  // }, []);

  // const { params } = match;
  // const taskGroupIdTemp = convertToInteger(params.taskGroupId);

  return (
    <>
      <Helmet>
        <title>
          TaskGroup Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/task-group/${taskGroupId}`} />
      </Helmet>
      <PageContentContainer>
        <TaskGroupTitleWrapper>
          <Link to="/system-settings">TaskGroups</Link>
          {' '}
          &gt;
          {' '}
          {taskGroup.taskGroupName}
          <SpanWithLinkStyle onClick={editTaskGroupClick}>
            <EditStyled />
          </SpanWithLinkStyle>
        </TaskGroupTitleWrapper>
      {/*  {taskGroup.taskGroupDescription && (*/}
      {/*    <InstructionsWrapper>*/}
      {/*      {taskGroup.taskGroupDescription}*/}
      {/*    </InstructionsWrapper>*/}
      {/*  )}*/}
      {/*  <TaskDefinitionListWrapper>*/}
      {/*    {taskDefinitionList.map((taskDefinition) => (*/}
      {/*      <OneTaskGroupWrapper key={`taskDefinition-${taskDefinition.id}`}>*/}
      {/*        {taskDefinition.taskName}*/}
      {/*        {' '}*/}
      {/*        <SpanWithLinkStyle onClick={() => editTaskDefinitionClick(taskDefinition.id)}>*/}
      {/*          <EditStyled />*/}
      {/*        </SpanWithLinkStyle>*/}
      {/*      </OneTaskGroupWrapper>*/}
      {/*    ))}*/}
      {/*  </TaskDefinitionListWrapper>*/}
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addTaskGroupButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addTaskDefinitionClick}
          >
            Add Task
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </>
  );
};
TaskGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTaskGroupButtonRoot: {
    width: 185,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const TaskGroupTitleWrapper = styled('div')`
  height: 100px;
  align-content: center;
`;

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

const OneTaskGroupWrapper = styled('div')`
  margin-bottom: 20px;
`;

const TaskDefinitionListWrapper = styled('div')`
  margin-top: 24px;
  padding-bottom: 24px;
`;

// const RequiredStar = styled('span')`
//   color: ${DesignTokenColors.alert800};
//   font-weight: bold;
// `;

// const TitleWrapper = styled('h1')`
//   line-height: 1.1;
//   margin-bottom: 8px;
// `;

export default withStyles(styles)(TaskGroup);
