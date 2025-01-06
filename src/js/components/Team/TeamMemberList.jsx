import React from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Delete, Edit } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { getFullNamePreferred, personQueryFn } from '../../react-query/PersonQuery';
import { getTeamPersonsList, teamsQueryFn } from '../../react-query/TeamsQuery';

const TeamMemberList = ({ teamId }) => {
  renderLog('TeamMemberList');  // Set LOG_RENDER_EVENTS to log all renders
  const { setAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes
  // const [listOfTeamsLoaded, setListOfTeamsLoaded] = React.useState(false);
  // const [listOfTeams, setListOfTeams] = React.useState([]);

  const [listOfTeamPersonsLoaded, setListOfTeamPersonsLoaded] = React.useState(false);
  const [listOfTeamPersons, setListOfTeamPersons] = React.useState([]);

  const removeTeamMemberMutation = useMutation({
    mutationFn: (personId) => personQueryFn('remove-person-from-team', { personId, teamId }),
  });

  // const { data, error, isLoading, isSuccess } = useQuery({
  //   queryKey: ['person-list-retrieve'],
  //   queryFn: ({ queryKey }) => personQueryFn(queryKey[0], { teamId }),
  // });
  //
  // if (isLoading) {
  //   console.log('Fetching team person members...');
  // } else if (error) {
  //   console.log(`An error occurred with person-list-retrieve: ${error.message}`);
  // } else if (isSuccess && !listOfTeamsLoaded) {
  //   setListOfTeamsLoaded(true);
  //   const personOnTeamListTemp = personListRetrieve(data, teamId);
  //   setPersonOnTeamList(personOnTeamListTemp);
  //   console.log('Successfully retrieved person list for team...');
  // }


  const { data: dataTeamPersons, error: errorTeamPersons, isLoading: isLoadingTeamPersons, isSuccess: isSuccessTeamPersons } = useQuery({
    queryKey: ['team-retrieve'],   // List of persons on a team by teamId
    queryFn: ({ queryKey }) => teamsQueryFn(queryKey[0], { teamId }),
  });

  if (isLoadingTeamPersons) {
    console.log('Fetching team person members, staff on a specific team...');
  } else if (errorTeamPersons) {
    console.log(`An error occurred with person-list-retrieve: ${errorTeamPersons.message}`);
  } else if (isSuccessTeamPersons && !listOfTeamPersonsLoaded) {
    setListOfTeamPersonsLoaded(true);
    const listOfPersonsOnTeamTemp = getTeamPersonsList(dataTeamPersons, teamId);
    setListOfTeamPersons(listOfPersonsOnTeamTemp);
    console.log('Successfully retrieved person list for team...');
  }


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
  return (
    <TeamMembersWrapper>
      {listOfTeamPersons.map((person, index) => (
        <OnePersonWrapper key={`teamMember-${person.personId}`}>
          <PersonCell id={`index-personId-${person.personId}`} width={15}>
            <GraySpan>
              {index + 1}
            </GraySpan>
          </PersonCell>
          <PersonCell
            id={`fullNamePreferred-personId-${person.personId}`}
            onClick={() => personProfileClick(person.personId)}
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: DesignTokenColors.primary500,
            }}
            width={150}
          >
            {getFullNamePreferred(person)}
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
              onClick={() => editPersonClick(person.personId, hasEditRights)}
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
          {hasEditRights ? (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              onClick={() => {
                removeTeamMemberMutation.mutate(person.personId);
              }}
              style={{ cursor: 'pointer' }}
              width={20}
            >
              <DeleteStyled />
            </PersonCell>
          ) : (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
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
