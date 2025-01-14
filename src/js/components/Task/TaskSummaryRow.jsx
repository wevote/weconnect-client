import React, { Suspense } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Edit, Info, Launch } from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material'; // FormLabel, Radio, RadioGroup,
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from '@mui/styles';
import TaskActions from '../../actions/TaskActions';
import TaskStore from '../../stores/TaskStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const TaskSummaryRow = (
  { classes, hideIfCompleted, personId, rowNumberForDisplay, taskDefinitionId,
    taskGroupId },
) => {
  renderLog('TaskSummaryRow');  // Set LOG_RENDER_EVENTS to log all renders
  // const [person, setTask] = React.useState({});

  const updateTaskFieldInstant = (event) => {
    if (event.target.name) {
      let newValue;
      if (event.target.type === 'checkbox') {
        newValue = event.target.checked;
      } else {
        newValue = event.target.value || '';
      }
      const data = {
        doneByPersonIdChanged: true,
        // doneByPersonIdToBeSaved: PersonStore.getSignedInPersonId(),
        doneByPersonIdToBeSaved: 1, // hard-coded for testing
        [`${event.target.name}Changed`]: true,
        [`${event.target.name}ToBeSaved`]: newValue,
      };
      let taskGroupIdTemp = taskGroupId;
      if (!taskGroupId) {
        taskGroupIdTemp = TaskStore.getTaskGroupIdByTaskDefinitionId(taskDefinitionId);
      }
      if (taskGroupIdTemp >= 0) {
        data.taskGroupIdChanged = true;
        data.taskGroupIdToBeSaved = taskGroupIdTemp;
      } else {
        data.taskGroupIdChanged = false;
      }
      // console.log('== updateTaskFieldInstant Before taskSave data:', data);
      TaskActions.taskSave(personId, taskDefinitionId, taskGroupIdTemp, data);
    } else {
      console.error('updateTaskFieldInstant Invalid event:', event);
    }
  };

  React.useEffect(() => {
  }, []);

  // const hasEditRights = true;
  const task = TaskStore.getTask(personId, taskDefinitionId);
  const taskDefinition = TaskStore.getTaskDefinitionById(taskDefinitionId);
  const taskId = `${personId}-${taskDefinitionId}`;
  if (hideIfCompleted && task.statusDone) {
    return null;
  }
  return (
    <OneTaskWrapper key={`teamMember-${taskId}`}>
      {rowNumberForDisplay && (
        <TaskCell id={`index-personId-${taskId}`} width={15}>
          <GraySpan>
            &nbsp;&nbsp;
          </GraySpan>
        </TaskCell>
      )}
      <TaskCell id={`taskName-${taskId}`} width={300}>
        {taskDefinition.taskDescription ? (
          <Tooltip arrow id={`taskDescription-${taskId}`} title={taskDefinition.taskDescription}>
            <span>{taskDefinition.taskName}</span>
          </Tooltip>
        ) : (
          <span>{taskDefinition.taskName}</span>
        )}
      </TaskCell>
      <TaskCell id={`statusDoneCell-${taskId}`} width={75}>
        {task.statusDone ? (
          <CheckboxDoneWrapper>
            <Checkbox
              id={`statusDoneCheckbox-${taskId}`}
              checked
              className={classes.checkboxDoneRoot}
              color="primary"
              disabled
              name="statusDone"
            />
            <CheckboxDone>Done</CheckboxDone>
          </CheckboxDoneWrapper>
        ) : (
          <CheckboxLabel
            classes={{ label: classes.checkboxLabel }}
            control={(
              <Checkbox
                id={`statusDoneCheckbox-${taskId}`}
                className={classes.checkboxRoot}
                color="primary"
                name="statusDone"
                onChange={updateTaskFieldInstant}
              />
            )}
            label="Done?"
          />
        )}
      </TaskCell>
      <TaskCell id={`taskInstructions-${taskId}`} width={24}>
        {(taskDefinition.taskInstructions) && (
          <Tooltip
            arrow
            enterTouchDelay={0} // show with click in mobile
            id={`taskDescription-${taskId}`}
            leaveTouchDelay={3000}
            title={taskDefinition.taskInstructions}
          >
            <InfoStyled />
          </Tooltip>
        )}
      </TaskCell>
      <TaskCell id={`taskActionUrlDiv-${taskId}`} width={24}>
        {(taskDefinition.taskActionUrl) && (
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute={`taskActionUrl-${taskId}`}
              url={taskDefinition.taskActionUrl}
              target="_blank"
              body={(
                <Tooltip arrow id={`taskActionUrlTooltip-${taskId}`} title={taskDefinition.taskActionUrl}>
                  <LaunchStyled />
                </Tooltip>
              )}
            />
          </Suspense>
        )}
      </TaskCell>
    </OneTaskWrapper>
  );
};
TaskSummaryRow.propTypes = {
  classes: PropTypes.object.isRequired,
  hideIfCompleted: PropTypes.bool,
  personId: PropTypes.number.isRequired,
  rowNumberForDisplay: PropTypes.number,
  taskDefinitionId: PropTypes.number.isRequired,
  taskGroupId: PropTypes.number,
};

const styles = () => ({
  checkboxDoneRoot: {
    marginLeft: '-10px',
    paddingTop: 0,
    paddingBottom: 0,
  },
  checkboxRoot: {
    paddingTop: 0,
    paddingLeft: '9px',
    paddingBottom: 0,
  },
  checkboxLabel: {
    marginLeft: '-6px',
    marginTop: 2,
  },
});

const CheckboxDone = styled('div')`
  color: ${DesignTokenColors.neutral300};
  margin-left: -6px;
`;

const CheckboxDoneWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 0 !important;
`;

const EditStyled = styled(Edit)`
  color: ${DesignTokenColors.neutral100};
  height: 16px;
  margin-left: 2px;
  width: 16px;
`;

const InfoStyled = styled(Info)`
  color: ${DesignTokenColors.neutral300};
  height: 20px;
  margin-left: 2px;
  width: 20px;
`;

const GraySpan = styled('span')`
  color: ${DesignTokenColors.neutral400};
`;

const LaunchStyled = styled(Launch)`
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const OneTaskWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TaskCell = styled('div', {
  shouldForwardProp: (prop) => !['smallFont', 'smallestFont', 'width'].includes(prop),
})(({ smallFont, smallestFont, width }) => (`
  align-content: center;
  // border-bottom: 1px solid #ccc;
  ${(smallFont && !smallestFont) ? 'font-size: .9em;' : ''};
  ${(smallestFont && !smallFont) ? 'font-size: .8em;' : ''};
  height: 28px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

export default withStyles(styles)(TaskSummaryRow);
