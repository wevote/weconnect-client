import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Delete, Edit } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';


const PersonSummaryRow = ({ person, rowNumberForDisplay, teamId }) => {
  renderLog('PersonSummaryRow');  // Set LOG_RENDER_EVENTS to log all renders
  const { setAppContextValue } = useConnectAppContext();

  const queryClient = useQueryClient();

  // const [removeTeamMember, { error, data }] = RemoveTeamMemberMutation(person.personId , teamId);
  // console.log('RemoveTeamMemberMutation called: ', error, data);

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

  const removeTeamMemberClick = () => {
    removeTeamMemberMutation.mutate(person.id);
  };

  const editPersonClick = (hasEditRights = true) => {
    if (hasEditRights) {
      setAppContextValue('editPersonDrawerOpen', true);
      setAppContextValue('editPersonDrawerPerson', person);
    }
  };

  const personProfileClick = () => {
    setAppContextValue('personProfileDrawerOpen', true);
    setAppContextValue('personProfileDrawerPerson', person);
  };

  const hasEditRights = true;
  return (
    <OnePersonWrapper key={`teamMember-${person.personId}`}>
      {rowNumberForDisplay && (
        <PersonCell id={`index-personId-${person.personId}`} width={15}>
          <GraySpan>
            {rowNumberForDisplay}
          </GraySpan>
        </PersonCell>
      )}
      <PersonCell
        id={`fullNamePreferred-personId-${person.personId}`}
        onClick={() => personProfileClick(person)}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          color: DesignTokenColors.primary500,
        }}
        width={150}
      >
        {person.firstName} {person.lastName}
      </PersonCell>
      <PersonCell id={`location-personId-${person.personId}`} $smallFont width={125}>
        {person.location}
      </PersonCell>
      <PersonCell id={`jobTitle-personId-${person.personId}`} $smallestFont width={190}>
        {person.jobTitle}
      </PersonCell>
      {hasEditRights ? (
        <PersonCell
          id={`editPerson-personId-${person.personId}`}
          onClick={() => editPersonClick(hasEditRights)}
          style={{ cursor: 'pointer' }}
          width={20}
        >
          <EditStyled />
        </PersonCell>
      ) : (
        <PersonCell
          id={`editPerson-personId-${person.personId}`}
          width={20}
        >
          &nbsp;
        </PersonCell>
      )}
      {teamId > 0 && (
        <>
          {hasEditRights ? (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              onClick={() => removeTeamMemberClick(person)}
              style={{ cursor: 'pointer' }}
              width={20}
            >
              <DeleteStyled />
            </PersonCell>
          ) : (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              onClick={() => removeTeamMemberClick(person)}
              width={20}
            >
              &nbsp;
            </PersonCell>
          )}
        </>
      )}
    </OnePersonWrapper>
  );
};
PersonSummaryRow.propTypes = {
  person: PropTypes.object.isRequired,
  rowNumberForDisplay: PropTypes.number,
  teamId: PropTypes.number,
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

export default withStyles(styles)(PersonSummaryRow);
