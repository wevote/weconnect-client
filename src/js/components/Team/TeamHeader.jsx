import { withStyles } from '@mui/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';
import { DeleteStyled, EditStyled } from '../Style/iconStyles';


// eslint-disable-next-line no-unused-vars
const TeamHeader = ({ classes, showHeaderLabels, showIcons, team }) => {
  renderLog('TeamHeader');
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();

  const queryClient = useQueryClient();
  const [teamLocal] = useState(useQueryClient(team || getAppContextValue('teamForAddTeamDrawer')));

  const removeTeamMutation = useMutation({
    mutationFn: (teamId) => weConnectQueryFn('team-delete', {
      teamId,
    }),
    onSuccess: () => {
      console.log('--------- removeMemberMutation mutated ---------');
      queryClient.invalidateQueries('team-list-retrieve').then(() => {});
    },
  });

  const removeTeamClick = () => {
    console.log('removeTeamMutation team: ', teamLocal.id);
    removeTeamMutation.mutate(teamLocal.id);
  };

  const editTeamClick = () => {
    console.log('editTeamClick: ', teamLocal);
    setAppContextValue('addTeamDrawerOpen', true);
    setAppContextValue('AddTeamDrawerLabel', 'Edit Team Name');
    setAppContextValue('teamForAddTeamDrawer', teamLocal);
  };

  return (
    <OneTeamHeader>
      {/* Width (below) of this TeamHeaderCell comes from the combined widths of the first x columns in TeamMemberList */}
      <TeamHeaderCell $largeFont $titleCell width={15 + 150 + 125}>
        {teamLocal && (
          <Link to={`/team-home/${teamLocal.id}`}>
            {teamLocal.teamName}
          </Link>
        )}
      </TeamHeaderCell>
      <TeamHeaderCell width={190}>
        {showHeaderLabels ? 'Title / Volunteering Love' : ''}
      </TeamHeaderCell>
      {/* Edit icon */}
      {showIcons && (
        <TeamHeaderCell width={20} onClick={editTeamClick}>
          <EditStyled />
        </TeamHeaderCell>
      )}
      {/* Delete icon */}
      {showIcons && (
        <TeamHeaderCell width={20} onClick={removeTeamClick}>
          <DeleteStyled />
        </TeamHeaderCell>
      )}
    </OneTeamHeader>
  );
};
TeamHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  showHeaderLabels: PropTypes.bool,
  team: PropTypes.object,
  showIcons: PropTypes.bool,
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

const OneTeamHeader = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const TeamHeaderCell = styled('div', {
  shouldForwardProp: (prop) => !['largeFont', 'titleCell', 'width'].includes(prop),
})(({ largeFont, titleCell, width }) => (`
  align-content: center;
  ${(titleCell) ? '' : 'border-bottom: 1px solid #ccc;'}
  ${(largeFont) ? 'font-size: 1.1em;' : 'font-size: .8em;'};
  ${(titleCell) ? '' : 'font-weight: 550;'}
  height: 22px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

export default withStyles(styles)(TeamHeader);
