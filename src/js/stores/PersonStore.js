import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';
import Cookies from '../common/utils/js-cookie/Cookies';

class PersonStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedPeopleDict: {}, // This is a dictionary key: personId, value: person dict
      person: {  // The person who is signed in
        firstName: '',
        lastName: '',
        personDeviceId: '',
      },
    };
  }

  getFirstName () {
    return this.getState().person.firstName || '';
  }

  getFirstPlusLastName () {
    const storedFirstName = this.getFirstName();
    const storedLastName = this.getLastName();
    let displayName = '';
    if (storedFirstName && String(storedFirstName) !== '') {
      displayName = storedFirstName;
      if (storedLastName && String(storedLastName) !== '') {
        displayName += ' ';
      }
    }
    if (storedLastName && String(storedLastName) !== '') {
      displayName += storedLastName;
    }
    return displayName;
  }

  getLastName () {
    return this.getState().person.lastName || '';
  }

  getPerson () {
    return this.getState().person;
  }

  getPersonById (personId) {
    const { allCachedPeopleDict } = this.getState();
    return allCachedPeopleDict[personId] || {};
  }

  getPersonDeviceId () {
    return this.getState().person.personDeviceId || Cookies.get('personDeviceId');
  }

  getStateCode () {
    // This defaults to state_code_from_ip_address but is overridden by the address the voter defaults to, or enters in text_for_map_search
    return this.getState().person.stateCode || '';
  }

  reduce (state, action) {
    switch (action.type) {
      case 'clearEmailAddressStatus':
        // console.log('VoterStore clearEmailAddressStatus');
        return { ...state, emailAddressStatus: {} };

      default:
        return state;
    }
  }
}

export default new PersonStore(Dispatcher);
