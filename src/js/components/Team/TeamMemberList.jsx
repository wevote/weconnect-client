import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import PersonSummaryRow from '../Person/PersonSummaryRow';

const TeamMemberList = ({ teamId }) => {
  renderLog('TeamMemberList');
  const { getAppContextValue } = useConnectAppContext();

  let teamMemberList = [];
  const teamListFromContext = getAppContextValue('teamListNested');
  if (teamListFromContext) {
    const oneTeam = teamListFromContext.find((staff) => staff.teamId === parseInt(teamId));
    if (oneTeam && oneTeam.teamMemberList.length > 0) {
      teamMemberList = oneTeam.teamMemberList;
    }
  } else {
    console.log('no teamListFromContext yet!');
  }

  return (
    <TeamMembersWrapper>
      {teamMemberList.map((person, index) => (
        <PersonSummaryRow
          key={`teamMember-${teamId}-${person.id}`}
          person={person}
          rowNumberForDisplay={index + 1}
          teamId={teamId}
        />
      ))}
    </TeamMembersWrapper>
  );
};
TeamMemberList.propTypes = {
  teamId: PropTypes.any.isRequired,
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

const TeamMembersWrapper = styled('div')`
`;

export default withStyles(styles)(TeamMemberList);
