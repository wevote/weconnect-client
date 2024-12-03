import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
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
};
