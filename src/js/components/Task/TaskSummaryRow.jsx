import { Info, Launch } from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material'; // FormLabel, Radio, RadioGroup,
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from '@mui/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { Suspense, useRef } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import makeRequestParams from '../../common/utils/requestParamsUtils';
import weConnectQueryFn from '../../react-query/WeConnectQuery';


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const TaskSummaryRow = ({ classes, hideIfCompleted, personId, rowNumberForDisplay, taskDefinition, task }) => {
  renderLog('TaskSummaryRow');  // Set LOG_RENDER_EVENTS to log all renders

  const doneCheckboxFldRef = useRef('');
  const queryClient = useQueryClient();

  const saveTaskMutation = useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('task-save', requestParams),
    onSuccess: () => {
      // console.log('--------- saveTaskMutation mutated ---------');
      queryClient.invalidateQueries('task-status-list-retrieve').then(() => {});
    },

  });

  const updateTaskFieldInstant = (event) => {
    console.log('updateTaskFieldInstant event:', event);
    const elementId = event.target.id;
    console.log(elementId);

    const requestParams = makeRequestParams({
      personId,
      taskDefinitionId: task.taskDefinitionId,
    }, {
      statusDone: !event.target.checked,
    });
    saveTaskMutation.mutate(requestParams);
  };

  if (hideIfCompleted && task.statusDone) {
    return null;
  }
  const taskDef = taskDefinition[0];
  return (
    <OneTaskWrapper key={`teamMember-${task.taskDefinitionId}`}>
      {rowNumberForDisplay && (
        <TaskCell id={`index-personId-${task.taskDefinitionId}`} width={15}>
          <GraySpan>
            {rowNumberForDisplay}
          </GraySpan>
        </TaskCell>
      )}
      <TaskCell id={`taskName-${task.taskDefinitionId}`} width={300}>
        {taskDef.taskDescription ? (
          <Tooltip arrow id={`taskDescription-${task.taskDefinitionId}`} title={taskDef.taskDescription}>
            <span>{taskDef.taskName}</span>
          </Tooltip>
        ) : (
          <span>{taskDef.taskName}</span>
        )}
      </TaskCell>
      <TaskCell id={`statusDoneCell-${task.taskDefinitionId}`} width={75}>
        {task.statusDone ? (
          <CheckboxDoneWrapper>
            <Checkbox
              checked
              className={classes.checkboxDoneRoot}
              color="primary"
              disabled
              id={`statusDoneCheckbox-${task.taskDefinitionId}`}
              inputRef={doneCheckboxFldRef}
              name="statusDone"
            />
            <CheckboxDone>Done</CheckboxDone>
          </CheckboxDoneWrapper>
        ) : (
          <CheckboxLabel
            classes={{ label: classes.checkboxLabel }}
            control={(
              <Checkbox
                className={classes.checkboxRoot}
                color="primary"
                id={`statusDoneCheckbox-${task.taskDefinitionId}`}
                inputRef={doneCheckboxFldRef}
                name="statusDone"
                onChange={updateTaskFieldInstant}
              />
            )}
            label="Done?"
          />
        )}
      </TaskCell>
      <TaskCell id={`taskInstructions-${task.taskDefinitionId}`} width={24}>
        {(taskDef.taskInstructions) && (
          <Tooltip
            arrow
            enterTouchDelay={0} // show with click in mobile
            id={`taskDescription-${task.taskDefinitionId}`}
            leaveTouchDelay={3000}
            title={taskDef.taskInstructions}
          >
            <InfoStyled />
          </Tooltip>
        )}
      </TaskCell>
      <TaskCell id={`taskActionUrlDiv-${task.taskDefinitionId}`} width={24}>
        {(taskDef.taskActionUrl) && (
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute={`taskActionUrl-${task.taskDefinitionId}`}
              url={taskDef.taskActionUrl}
              target="_blank"
              body={(
                <Tooltip arrow id={`taskActionUrlTooltip-${task.taskDefinitionId}`} title={taskDef.taskActionUrl}>
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
  hideIfCompleted: PropTypes.bool.isRequired,
  personId: PropTypes.number.isRequired,
  rowNumberForDisplay: PropTypes.number.isRequired,
  taskDefinition: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
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
