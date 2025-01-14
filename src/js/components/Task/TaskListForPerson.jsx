import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TaskStore from '../../stores/TaskStore';
import TaskSummaryRow from './TaskSummaryRow';
import { renderLog } from '../../common/utils/logging';


const TaskListForPerson = ({ personId, showCompletedTasks }) => {
  renderLog('TaskListForPerson');  // Set LOG_RENDER_EVENTS to log all renders
  const [taskList, setTaskList] = React.useState([]);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTaskStatusListChange = () => {
    const taskListTemp = TaskStore.getTaskListForPerson(personId);
    setTaskList(taskListTemp);
  };

  const onPersonStoreChange = () => {
    onRetrieveTaskStatusListChange();
  };

  const onTaskStoreChange = () => {
    onRetrieveTaskStatusListChange();
  };

  React.useEffect(() => {
    // setTaskListForPerson([]);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const taskStoreListener = TaskStore.addListener(onTaskStoreChange);
    onTaskStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      taskStoreListener.remove();
    };
  }, []);

  React.useEffect(() => {
    // console.log('useEffect personId changed:', personId);
  }, [personId]);

  // const taskList = TaskStore.getTaskListForPerson(personId);
  return (
    <TaskListWrapper>
      {taskList.map((task, index) => (
        <TaskSummaryRow
          hideIfCompleted={!showCompletedTasks}
          key={`taskSummaryRow-${task.personId}-${task.taskDefinitionId}`}
          personId={personId}
          taskDefinitionId={task.taskDefinitionId}
          taskGroupId={task.taskGroupId}
          rowNumberForDisplay={index + 1}
        />
      ))}
    </TaskListWrapper>
  );
};
TaskListForPerson.propTypes = {
  personId: PropTypes.number.isRequired,
  showCompletedTasks: PropTypes.bool,
};

const TaskListWrapper = styled('div')`
  margin-bottom: 8px;
`;

export default TaskListForPerson;
