import Dispatcher from '../common/dispatcher/Dispatcher';
import PersonStore from '../stores/PersonStore'; // eslint-disable-line import/no-cycle
import TeamStore from '../stores/TeamStore'; // eslint-disable-line import/no-cycle

export default {
  addPersonToTeam (personId, teamId) {
    // console.log('TeamActions, addPersonToTeam personId:', personId, ', teamId:', teamId);
    const teamMemberFirstName = PersonStore.getFirstName(personId) || '';
    const teamMemberLastName = PersonStore.getLastName(personId) || '';
    const teamName = TeamStore.getTeamName(teamId) || '';
    const data = {
      personId,
      teamId,
      teamMemberFirstName,
      teamMemberLastName,
      teamName,
    };
    Dispatcher.loadEndpoint('add-person-to-team', data);
  },

  removePersonFromTeam (personId, teamId) {
    // console.log('TeamActions, removePersonFromTeam personId:', personId, ', teamId:', teamId);
    const data = {
      personId,
      teamId,
    };
    Dispatcher.loadEndpoint('remove-person-from-team', data);
  },

  teamRetrieve (teamId = '') {
    // console.log('TeamActions, teamRetrieve teamId:', teamId);
    if (teamId) {
      Dispatcher.loadEndpoint('team-retrieve', {
        teamId,
      });
    } else {
      Dispatcher.loadEndpoint('team-retrieve');
    }
  },

  teamListRetrieve () {
    // console.log('TeamActions, teamListRetrieve');
    Dispatcher.loadEndpoint('team-list-retrieve');
  },

  teamSave (teamId = '', incomingData = {}) {
    // console.log('PersonActions, teamSave teamId:', teamId, ', incomingData:', incomingData);
    const data = {
      teamId,
      ...incomingData,
    };
    Dispatcher.loadEndpoint('team-save', data);
  },
};
