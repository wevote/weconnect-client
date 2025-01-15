import React from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import PersonSummaryRow from '../Person/PersonSummaryRow';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';
import {
  RemoveTeamMemberMutation
} from '../../react-query/selfContainedMutations';

const TeamMemberList = ({ teamId }) => {
  renderLog('TeamMemberList');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();

  const queryClient = useQueryClient();

  // const [removeTeamMember, { isLoading, error, data }] = RemoveTeamMemberMutation(personId, teamId);
  // console.log('RemoveTeamMemberMutation called: ', isLoading, error, data);

  // const removeTeamMemberMutation = useMutation({
  //   mutationFn: (personId) => weConnectQueryFn('remove-person-from-team', {
  //     personId,
  //     teamId,
  //   }),
  //   onSuccess: () => {
  //     console.log('--------- removeTeamMemberMutation mutated ---------');
  //     queryClient.invalidateQueries('team-list-retrieve').then(() => {});
  //   },
  // });

  const editPersonClick = (person, hasEditRights = true) => {
    if (hasEditRights) {
      setAppContextValue('editPersonDrawerOpen', true);
      setAppContextValue('editPersonDrawerPerson', person);
    }
  };


  const hasEditRights = true;
  let teamMemberList = [];
  const teamListFromContext = getAppContextValue('teamListNested');
  if (teamListFromContext) {
    const oneTeam = teamListFromContext.find((staff) => staff.teamId === parseInt(teamId));
    if (oneTeam && oneTeam.teamMemberList.length > 0) {
      teamMemberList = oneTeam.teamMemberList;
    }
  } else {
    // console.log('no teamListFromContext yet!');
  }

  // return (
  //   <TeamMembersWrapper>
  //     {teamMemberList.length > 0 && teamMemberList.map((teamMember, index) => (
  //       <OnePersonWrapper key={`teamMember-${teamMember.personId}`}>
  //         <PersonCell id={`index-personId-${teamMember.personId}`} width={15}>
  //           <GraySpan>
  //             {index + 1}
  //           </GraySpan>
  //         </PersonCell>
  //         <PersonCell
  //           id={`fullNamePreferred-personId-${teamMember.personId}`}
  //           onClick={() => personProfileClick(teamMember)}
  //           style={{
  //             cursor: 'pointer',
  //             textDecoration: 'underline',
  //             color: DesignTokenColors.primary500,
  //           }}
  //           width={150}
  //         >
  //           {getFullNamePreferred(teamMember)}
  //         </PersonCell>
  //         <PersonCell id={`location-personId-${teamMember.personId}`} $smallFont width={125}>
  //           {teamMember.location}
  //         </PersonCell>
  //         <PersonCell id={`jobTitle-personId-${teamMember.personId}`} $smallestFont width={190}>
  //           {teamMember.jobTitle}
  //         </PersonCell>
  //         {hasEditRights ? (
  //           <PersonCell
  //             id={`editPerson-personId-${teamMember.personId}`}
  //             onClick={() => editPersonClick(teamMember, hasEditRights)}
  //             style={{ cursor: 'pointer' }}
  //             width={20}
  //           >
  //             <EditStyled />
  //           </PersonCell>
  //         ) : (
  //           <PersonCell
  //             id={`editPerson-personId-${teamMember.personId}`}
  //             width={20}
  //           >
  //             &nbsp;
  //           </PersonCell>
  //         )}
  //         {hasEditRights ? (
  //           <PersonCell
  //             id={`removeMember-personId-${teamMember.personId}`}
  //             onClick={() => {
  //               removeTeamMemberMutation.mutate(teamMember.personId);
  //             }}
  //             style={{ cursor: 'pointer' }}
  //             width={20}
  //           >
  //             <DeleteStyled />
  //           </PersonCell>
  //         ) : (
  //           <PersonCell
  //             id={`removeMember-personId-${teamMember.personId}`}
  //             width={20}
  //           >
  //             &nbsp;
  //           </PersonCell>
  //         )}
  //       </OnePersonWrapper>


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
