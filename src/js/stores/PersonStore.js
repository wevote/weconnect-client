import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';
import Cookies from '../common/utils/js-cookie/Cookies';
import arrayContains from '../common/utils/arrayContains';

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
    // console.log('PersonStore getPersonById:', personId, ', allCachedPeopleDict:', allCachedPeopleDict);
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
    let { allCachedPeopleDict } = state;
    let revisedState = state;
    let teamId = -1;
    let teamMemberList = [];

    switch (action.type) {
      case 'team-retrieve':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        teamId = action.res.teamId || -1;
        teamMemberList = action.res.teamMemberList || [];
        revisedState = state;

        // console.log('PersonStore team-retrieve start allCachedPeopleDict:', allCachedPeopleDict);
        if (!allCachedPeopleDict) {
          allCachedPeopleDict = {};
        }
        if (teamId > 0) {
          teamMemberList.forEach((person) => {
            // console.log('PersonStore team-retrieve adding person:', person);
            if (person && (person.id >= 0) && !arrayContains(person.id, allCachedPeopleDict)) {
              allCachedPeopleDict[person.id] = person;
            }
          });
          // console.log('allCachedPeopleDict:', allCachedPeopleDict);
          revisedState = {
            ...revisedState,
            allCachedPeopleDict,
          };
        }
        return revisedState;

      default:
        return state;
    }
  }
}

export default new PersonStore(Dispatcher);
