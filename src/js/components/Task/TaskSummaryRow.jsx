import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Delete, Edit } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamActions from '../../actions/TeamActions';
import TeamStore from '../../stores/TeamStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';


const TaskSummaryRow = ({ personId, rowNumberForDisplay, taskDefinitionId }) => {
  renderLog('TaskSummaryRow');  // Set LOG_RENDER_EVENTS to log all renders
  // const [person, setTask] = React.useState({});

  // const editTaskClick = (personId, hasEditRights = true) => {
  //   if (hasEditRights) {
  //     AppObservableStore.setGlobalVariableState('editTaskDrawerOpen', true);
  //     AppObservableStore.setGlobalVariableState('editTaskDrawerPersonId', personId);
  //   }
  // };

  // const personProfileClick = (personId) => {
  //   AppObservableStore.setGlobalVariableState('personProfileDrawerOpen', true);
  //   AppObservableStore.setGlobalVariableState('personProfileDrawerPersonId', personId);
  // };

  React.useEffect(() => {
  }, []);

  // const hasEditRights = true;
  const taskId = `${personId}-${taskDefinitionId}`;
  return (
    <OneTaskWrapper key={`teamMember-${taskId}`}>
      {rowNumberForDisplay && (
        <TaskCell id={`index-personId-${taskId}`} width={15}>
          <GraySpan>
            {rowNumberForDisplay}
          </GraySpan>
        </TaskCell>
      )}
      <TaskCell
        id={`fullNamePreferred-personId-${taskId}`}
        // onClick={() => personProfileClick(taskId)}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          color: DesignTokenColors.primary500,
        }}
        width={150}
      >
        Task-Name-Here
      </TaskCell>
      <TaskCell id={`location-personId-${taskId}`} smallFont width={125}>
        Cell 2
        {/* {TaskStore.getTaskById(taskId).location} */}
      </TaskCell>
      <TaskCell id={`jobTitle-personId-${taskId}`} smallestFont width={190}>
        Cell 3
      </TaskCell>
      {/* {hasEditRights ? (
        <TaskCell
          id={`editTask-personId-${taskId}`}
          onClick={() => editTaskClick(taskId, hasEditRights)}
          style={{ cursor: 'pointer' }}
          width={20}
        >
          <EditStyled />
        </TaskCell>
      ) : (
        <TaskCell
          id={`editTask-personId-${taskId}`}
          width={20}
        >
          &nbsp;
        </TaskCell>
      )} */}
      {/* {teamId && (
        <>
          {hasEditRights ? (
            <TaskCell
              id={`removeMember-personId-${taskId}`}
              onClick={() => TeamActions.removeTaskFromTeam(taskId, teamId)}
              style={{ cursor: 'pointer' }}
              width={20}
            >
              <DeleteStyled />
            </TaskCell>
          ) : (
            <TaskCell
              id={`removeMember-personId-${taskId}`}
              width={20}
            >
              &nbsp;
            </TaskCell>
          )}
        </>
      )} */}
    </OneTaskWrapper>
  );
};
TaskSummaryRow.propTypes = {
  personId: PropTypes.number.isRequired,
  rowNumberForDisplay: PropTypes.number,
  taskDefinitionId: PropTypes.number.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamButtonRoot: {
    width: 120,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const DeleteStyled = styled(Delete)`
  color: ${DesignTokenColors.neutral200};
  width: 20px;
  height: 20px;
`;

const EditStyled = styled(Edit)`
  color: ${DesignTokenColors.neutral100};
  height: 16px;
  margin-left: 2px;
  width: 16px;
`;

const GraySpan = styled('span')`
  color: ${DesignTokenColors.neutral400};
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
  height: 22px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

export default withStyles(styles)(TaskSummaryRow);
