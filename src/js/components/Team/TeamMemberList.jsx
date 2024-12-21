import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';


const TeamMemberList = ({ classes, teamId }) => {
  renderLog('TeamMemberList');  // Set LOG_RENDER_EVENTS to log all renders
  const [teamMemberList, setTeamMemberList] = React.useState([]);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamListChange = () => {
    // console.log('TeamMemberList onRetrieveTeamListChange, teamId:', teamId, ', TeamStore.getTeamMemberList:', TeamStore.getTeamMemberList(teamId));
    setTeamMemberList(TeamStore.getTeamMemberList(teamId));
  };

  const onPersonStoreChange = () => {
    onRetrieveTeamListChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamListChange();
  };

  const editPersonClick = (personId) => {
    AppObservableStore.setGlobalVariableState('editPersonDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('editPersonDrawerPersonId', personId);
  };

  React.useEffect(() => {
    setTeamMemberList([]);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <TeamMembersWrapper>
      {teamMemberList.map((person) => (
        <OnePersonWrapper key={`teamMember-${person.personId}`}>
          <PersonCell
            id={`fullNamePreferred-personId-${person.personId}`}
            onClick={() => editPersonClick(person.personId)}
            style={{ cursor: 'pointer' }}
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
        </OnePersonWrapper>
      ))}
    </TeamMembersWrapper>
  );
};
TeamMemberList.propTypes = {
  classes: PropTypes.object.isRequired,
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
