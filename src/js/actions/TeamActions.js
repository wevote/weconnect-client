import Dispatcher from '../common/dispatcher/Dispatcher';
import PersonStore from '../stores/PersonStore'; // eslint-disable-line import/no-cycle
import TeamStore from '../stores/TeamStore'; // eslint-disable-line import/no-cycle

export default {
  addPersonToTeam (personId, teamId) {
    console.log('TeamActions, addPersonToTeam personId:', personId, ', teamId:', teamId);
    const teamMemberName = PersonStore.getFullNamePreferred(personId) || '';
    const data = {
      personId,
      teamId,
      teamMemberName,
      teamName: TeamStore.getTeamById(teamId).teamName || '',
    };
    Dispatcher.loadEndpoint('add-person-to-team', data);
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
