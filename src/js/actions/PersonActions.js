import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  personRetrieve (personId = '') {
    // console.log('PersonActions, personRetrieve personId:', personId);
    if (personId) {
      Dispatcher.loadEndpoint('person-retrieve', {
        personId,
      });
    } else {
      Dispatcher.loadEndpoint('person-retrieve');
    }
  },
};
