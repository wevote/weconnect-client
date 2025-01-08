import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Delete, Edit } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { getFullNamePreferred } from '../../react-query/PersonQueryProcessing';
import { getTeamList } from '../../react-query/TeamsQueryProcessing';
import weConnectQueryFn from '../../react-query/WeConnectQuery';
import useFetchData from '../../react-query/fetchData';

const TeamMemberList = ({ teamId }) => {
  renderLog('TeamMemberList');  // Set LOG_RENDER_EVENTS to log all renders
  console.log('TeamMemberList teamId: ', teamId);
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes
  const queryClient = useQueryClient();

  const removeTeamMemberMutation = useMutation({
    mutationFn: (personId) => weConnectQueryFn('remove-person-from-team', {
      personId,
      teamId,
    }),
    onSuccess: () => {
      console.log('--------- removeTeamMemberMutation mutated ---------');
      queryClient.invalidateQueries('team-list-retrieve').then(() => {});
    },
  });

  const { data, isSuccess } = useFetchData('team-list-retrieve', {});
  useEffect(() => {
    console.log('teamListNested update with newly fetched data in TeamMemberList, isSuccess: ', isSuccess);
    if (isSuccess) {
      const tList = getTeamList(data);
      setAppContextValue('teamListNested', tList);
    }
  }, [data]);

  const editPersonClick = (personId, hasEditRights = true) => {
    if (hasEditRights) {
      setAppContextValue('editPersonDrawerOpen', true);
      setAppContextValue('editPersonDrawerPersonId', personId);
    }
  };

  const personProfileClick = (personId) => {
    setAppContextValue('personProfileDrawerOpen', true);
    setAppContextValue('personProfileDrawerPersonId', personId);
  };

  const hasEditRights = true;
  let teamMemberList = [];
  const teamListFromContext = getAppContextValue('teamListNested');
  if (teamListFromContext) {
    const oneTeam = teamListFromContext[parseInt(teamId) - 1];
    if (oneTeam && oneTeam.teamMemberList.length > 0) {
      teamMemberList = oneTeam.teamMemberList;
    }
  } else {
    // console.log('no teamListFromContext yet!');
  }

  return (
    <TeamMembersWrapper>
      {teamMemberList.length > 0 && teamMemberList.map((teamMember, index) => (
        <OnePersonWrapper key={`teamMember-${teamMember.personId}`}>
          <PersonCell id={`index-personId-${teamMember.personId}`} width={15}>
            <GraySpan>
              {index + 1}
            </GraySpan>
          </PersonCell>
          <PersonCell
            id={`fullNamePreferred-personId-${teamMember.personId}`}
            onClick={() => personProfileClick(teamMember.personId)}
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: DesignTokenColors.primary500,
            }}
            width={150}
          >
            {getFullNamePreferred(teamMember)}
          </PersonCell>
          <PersonCell id={`location-personId-${teamMember.personId}`} $smallFont width={125}>
            {teamMember.location}
          </PersonCell>
          <PersonCell id={`jobTitle-personId-${teamMember.personId}`} $smallestFont width={190}>
            {teamMember.jobTitle}
          </PersonCell>
          {hasEditRights ? (
            <PersonCell
              id={`editPerson-personId-${teamMember.personId}`}
              onClick={() => editPersonClick(teamMember.personId, hasEditRights)}
              style={{ cursor: 'pointer' }}
              width={20}
            >
              <EditStyled />
            </PersonCell>
          ) : (
            <PersonCell
              id={`editPerson-personId-${teamMember.personId}`}
              width={20}
            >
              &nbsp;
            </PersonCell>
          )}
          {hasEditRights ? (
            <PersonCell
              id={`removeMember-personId-${teamMember.personId}`}
              onClick={() => {
                removeTeamMemberMutation.mutate(teamMember.personId);
              }}
              style={{ cursor: 'pointer' }}
              width={20}
            >
              <DeleteStyled />
            </PersonCell>
          ) : (
            <PersonCell
              id={`removeMember-personId-${teamMember.personId}`}
              width={20}
            >
              &nbsp;
            </PersonCell>
          )}
        </OnePersonWrapper>
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

const OnePersonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PersonCell = styled('div', {
  shouldForwardProp: (prop) => !['smallFont', 'smallestFont', 'width'].includes(prop),
})(({ smallFont, smallestFont, width }) => (`
  align-content: center;
  border-bottom: 1px solid #ccc;
  ${(smallFont && !smallestFont) ? 'font-size: .9em;' : ''};
  ${(smallestFont && !smallFont) ? 'font-size: .8em;' : ''};
  height: 22px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

const TeamMembersWrapper = styled('div')`
`;

export default withStyles(styles)(TeamMemberList);
