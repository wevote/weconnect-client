import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import TaskActions from '../../actions/TaskActions';
import TaskStore from '../../stores/TaskStore';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import webAppConfig from '../../config';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import convertToInteger from '../../common/utils/convertToInteger';


const TaskGroup = ({ classes, match }) => {
  renderLog('TaskGroup');  // Set LOG_RENDER_EVENTS to log all renders
  const [taskDefinitionList, setTaskDefinitionList] = React.useState([]);
  const [taskGroup, setTaskGroup] = React.useState({});
  const [taskGroupCount, setTaskGroupCount] = React.useState(0);

  const onAppObservableStoreChange = () => {
  };

  const onTaskStoreChange = () => {
    const { params } = match;
    const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    const taskGroupTemp = TaskStore.getTaskGroupById(taskGroupIdTemp);
    setTaskGroup(taskGroupTemp);
    const taskDefinitionListTemp = TaskStore.getTaskDefinitionListByTaskGroupId(taskGroupIdTemp);
    // console.log('TaskGroup TaskStore.getTaskDefinitionList:', taskDefinitionListTemp);
    setTaskDefinitionList(taskDefinitionListTemp);
    setTaskGroupCount(taskDefinitionListTemp.length);
  };

  const addTaskDefinitionClick = () => {
    const { params } = match;
    const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId', -1);
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerTaskGroupId', taskGroupIdTemp);
  };

  const editTaskDefinitionClick = (taskDefinitionId) => {
    const { params } = match;
    const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId', taskDefinitionId);
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerTaskGroupId', taskGroupIdTemp);
  };

  const editTaskGroupClick = () => {
    const { params } = match;
    const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', taskGroupIdTemp);
  };

  React.useEffect(() => {
    const { params } = match;
    const taskGroupIdTemp = convertToInteger(params.taskGroupId);

    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const taskGroupStoreListener = TaskStore.addListener(onTaskStoreChange);
    onTaskStoreChange();

    if (taskGroupIdTemp >= 0) {
      if (apiCalming('taskGroupListRetrieve', 1000)) {
        TaskActions.taskGroupListRetrieve();
      }
      if (apiCalming(`taskDefinitionListRetrieve-${taskGroupIdTemp}`, 1000)) {
        TaskActions.taskDefinitionListRetrieve(taskGroupIdTemp);
      }
    }

    return () => {
      appStateSubscription.unsubscribe();
      taskGroupStoreListener.remove();
    };
  }, []);

  const { params } = match;
  const taskGroupIdTemp = convertToInteger(params.taskGroupId);

  return (
    <div>
      <Helmet>
        <title>
          TaskGroup Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/task-group/${taskGroupIdTemp}`} />
      </Helmet>
      <PageContentContainer>
        <div>
          <Link to="/system-settings">TaskGroups</Link>
          {' '}
          &gt;
          {' '}
          {taskGroup.taskGroupName}
          <SpanWithLinkStyle onClick={editTaskGroupClick}>
            <EditStyled />
          </SpanWithLinkStyle>
        </div>
        {taskGroup.taskGroupDescription && (
          <InstructionsWrapper>
            {taskGroup.taskGroupDescription}
          </InstructionsWrapper>
        )}
        <TaskDefinitionListWrapper>
          {taskDefinitionList.map((taskDefinition) => (
            <OneTaskGroupWrapper key={`taskDefinition-${taskDefinition.id}`}>
              {taskDefinition.taskName}
              {' '}
              <SpanWithLinkStyle onClick={() => editTaskDefinitionClick(taskDefinition.id)}>
                <EditStyled />
              </SpanWithLinkStyle>
            </OneTaskGroupWrapper>
          ))}
        </TaskDefinitionListWrapper>
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
    </div>
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

const RequiredStar = styled('span')`
  color: ${DesignTokenColors.alert800};
  font-weight: bold;
`;

const TitleWrapper = styled('h1')`
  line-height: 1.1;
  margin-bottom: 8px;
`;

export default withStyles(styles)(TaskGroup);
