import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Edit, Delete } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import TeamActions from '../../actions/TeamActions';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { useWeAppContext } from '../../contexts/WeAppContext';


const TeamMemberList = ({ teamId }) => {
  renderLog('TeamMemberList');  // Set LOG_RENDER_EVENTS to log all renders
  const { setAppContextValue } = useWeAppContext();  // This component will re-render whenever the value of WeAppContext changes

  // const [teamMemberList, setTeamMemberList] = React.useState([]);

  // const onAppObservableStoreChange = () => {
  // };

  const onRetrieveTeamListChange = () => {
    // TODO: Why is this 'teamId' value changing to -1 after team-retrieve API returns?
    // console.log('TeamMemberList onRetrieveTeamListChange, teamId:', teamId, ', TeamStore.getTeamMemberList:', TeamStore.getTeamMemberList(teamId));
    // console.log('TeamStore state:', TeamStore.getState());
    // console.log('TeamMemberList:', TeamStore.getTeamMemberList(teamId));
    // setTeamMemberList();
  };

  const onPersonStoreChange = () => {
    // onRetrieveTeamListChange();
  };

  const onTeamStoreChange = () => {
    // onRetrieveTeamListChange();
  };

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

  React.useEffect(() => {
    // setTeamMemberList([]);
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  React.useEffect(() => {
    // console.log('useEffect teamId changed:', teamId);
    onRetrieveTeamListChange();
  }, [teamId]);

  const teamMemberList = TeamStore.getTeamMemberList(teamId);
  const hasEditRights = true;
  return (
    <TeamMembersWrapper>
      {teamMemberList.map((person, index) => (
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
            {PersonStore.getFullNamePreferred(person.personId)}
          </PersonCell>
          <PersonCell id={`location-personId-${person.personId}`} smallFont width={125}>
            {PersonStore.getPersonById(person.personId).location}
          </PersonCell>
          <PersonCell id={`jobTitle-personId-${person.personId}`} smallestFont width={190}>
            {PersonStore.getPersonById(person.personId).jobTitle}
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
              onClick={() => TeamActions.removePersonFromTeam(person.personId, teamId)}
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
