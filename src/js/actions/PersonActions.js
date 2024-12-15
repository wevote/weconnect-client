import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  personListRetrieve (searchText = '') {
    // console.log('PersonActions, personListRetrieve searchText:', searchText);
    if (searchText) {
      Dispatcher.loadEndpoint('person-list-retrieve', {
        searchText,
      });
    } else {
      Dispatcher.loadEndpoint('person-list-retrieve');
    }
  },

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

  personSave (personId = '', incomingData = {}) {
    // console.log('PersonActions, personSave personId:', personId, ', incomingData:', incomingData);
    const data = {
      personId,
      ...incomingData,
    };
    Dispatcher.loadEndpoint('person-save', data);
  },
};
