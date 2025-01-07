import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import TeamStore from '../../stores/TeamStore';
import PersonSummaryRow from '../Person/PersonSummaryRow';
import { renderLog } from '../../common/utils/logging';


const TeamMemberList = ({ teamId }) => {
  renderLog('TeamMemberList');  // Set LOG_RENDER_EVENTS to log all renders
  // const [teamMemberList, setTeamMemberList] = React.useState([]);

  const onTeamStoreChange = () => {
    // onRetrieveTeamListChange();
  };

  React.useEffect(() => {
    // setTeamMemberList([]);
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    return () => {
      teamStoreListener.remove();
    };
  }, []);

  React.useEffect(() => {
    // console.log('useEffect teamId changed:', teamId);
    onTeamStoreChange();
  }, [teamId]);

  const teamMemberList = TeamStore.getTeamMemberList(teamId);
  return (
    <TeamMembersWrapper>
      {teamMemberList.map((person, index) => (
        <PersonSummaryRow person={person} rowNumberForDisplay={index + 1} teamId={teamId} />
      ))}
    </TeamMembersWrapper>
  );
};
TeamMemberList.propTypes = {
  teamId: PropTypes.number.isRequired,
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
