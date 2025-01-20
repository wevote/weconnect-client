import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import TaskSummaryRow from './TaskSummaryRow';


const TaskListForPerson = ({ personId, showCompletedTasks, taskDefinitionList, taskListForPersonId }) => {
  renderLog('TaskListForPerson');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <TaskListWrapper>
      {taskListForPersonId.map((task, index) => (
        <TaskSummaryRow
          hideIfCompleted={!showCompletedTasks}
          key={`taskSummaryRow-${task.personId}-${task.taskDefinitionId}`}
          personId={personId}
          taskDefinition={taskDefinitionList.filter((taskDefEntry) => taskDefEntry.taskDefinitionId === task.taskDefinitionId)}
          task={task}
          rowNumberForDisplay={index + 1}
        />
      ))}
    </TaskListWrapper>
  );
};
TaskListForPerson.propTypes = {
  personId: PropTypes.number.isRequired,
  showCompletedTasks: PropTypes.bool,
  taskDefinitionList: PropTypes.object,
  taskListForPersonId: PropTypes.object,
};

const TaskListWrapper = styled('div')`
  margin-bottom: 8px;
`;

export default TaskListForPerson;
