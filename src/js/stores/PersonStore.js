import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';
import Cookies from '../common/utils/js-cookie/Cookies';
import arrayContains from '../common/utils/arrayContains';

class PersonStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedPeopleDict: {}, // This is a dictionary key: personId, value: person dict
      mostRecentPersonIdSaved: -1,
      mostRecentPersonSaved: {
        firstName: '',
        lastName: '',
        personId: '',
      },
      searchResults: [],
    };
  }

  getFirstName (personId) {
    const person = this.getPersonById(personId);
    return person.firstName || '';
  }

  getFullNamePreferred (personId) {
    const person = this.getPersonById(personId);
    let fullName = '';
    if (person.id >= 0) {
      if (person.firstNamePreferred) {
        fullName += person.firstNamePreferred;
      } else if (person.firstName) {
        fullName += person.firstName;
      }
      if (fullName.length > 0 && person.lastName) {
        fullName += ' ';
      }
      if (person.lastName) {
        fullName += person.lastName;
      }
    }
    return fullName;
  }

  getFirstPlusLastName (personId) {
    const storedFirstName = this.getFirstName(personId);
    const storedLastName = this.getLastName(personId);
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

  getLastName (personId) {
    const person = this.getPersonById(personId);
    return person.lastName || '';
  }

  getMostRecentPersonChanged () {
    // console.log('PersonStore getMostRecentPersonChanged Id:', this.getState().mostRecentPersonIdSaved);
    if (this.getState().mostRecentPersonIdSaved !== -1) {
      return this.getPersonById(this.getState().mostRecentPersonIdSaved);
    }
    return {};
  }

  getPersonById (personId) {
    const { allCachedPeopleDict } = this.getState();
    // console.log('PersonStore getPersonById:', personId, ', allCachedPeopleDict:', allCachedPeopleDict);
    return allCachedPeopleDict[personId] || {};
  }

  getPersonDeviceId () {
    return this.getState().person.personDeviceId || Cookies.get('personDeviceId');
  }

  getStateCode (personId) {
    const person = this.getPersonById(personId);
    return person.stateCode || '';
  }

  getSearchResults () {
    // console.log('PersonStore getSearchResults:', this.getState().searchResults);
    return this.getState().searchResults || [];
  }

  reduce (state, action) {
    const { allCachedPeopleDict } = state;
    let personId = -1;
    let revisedState = state;
    let searchResults = [];
    let teamId = -1;
    let teamMemberList = [];

    switch (action.type) {
      case 'person-list-retrieve':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('PersonStore person-list-retrieve personList:', action.res.personList);
        if (action.res.isSearching && action.res.isSearching === true) {
          // console.log('PersonStore isSearching:', action.res.isSearching);
          searchResults = action.res.personList;
          // console.log('PersonStore searchResults:', searchResults);
          revisedState = {
            ...revisedState,
            searchResults,
          };
        }
        // console.log('PersonStore revisedState:', revisedState);
        return revisedState;

      case 'person-save':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        personId = action.res.personId || -1;

        if (personId >= 0) {
          // console.log('PersonStore person-save personId:', personId);
          allCachedPeopleDict[personId] = action.res;
          revisedState = {
            ...revisedState,
            allCachedPeopleDict,
            mostRecentPersonIdSaved: personId,
          };
        } else {
          console.log('PersonStore person-save MISSING personId:', personId);
        }
        return revisedState;

      case 'team-retrieve':
      case 'team-save':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        teamId = action.res.teamId || -1;

        // console.log('PersonStore ', action.type, ' start allCachedPeopleDict:', allCachedPeopleDict);
        if (teamId >= 0 && action.res.teamMemberList) {
          teamMemberList = action.res.teamMemberList || [];
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
