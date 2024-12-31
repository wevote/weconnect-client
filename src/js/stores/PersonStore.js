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

  getAllCachedPeopleList () {
    const { allCachedPeopleDict } = this.getState();
    const personListRaw = Object.values(allCachedPeopleDict);

    const personList = [];
    let personFiltered;
    let personRaw;
    for (let i = 0; i < personListRaw.length; i++) {
      personRaw = personListRaw[i];
      // console.log('PersonStore getAllCachedPeopleList person:', person);
      personFiltered = personRaw;
      personList.push(personFiltered);
    }
    return personList;
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
    let personTemp = {};
    let personId = -1;
    let revisedState = state;
    let searchResults = [];
    let teamId = -1;
    let teamList = [];
    let teamMemberList = [];

    switch (action.type) {
      case 'add-person-to-team':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // if (action.res.teamId >= 0) {
        //   teamId = action.res.teamId;
        // } else {
        //   teamId = -1;
        // }

        // console.log('PersonStore ', action.type, ' start action.res:', action.res);
        if (action.res) {
          personTemp = action.res;
          // console.log('PersonStore add-person-to-team:', personTemp);
          // Only add to allCachedPeopleDict if they aren't already in the dictionary, since the person data that comes back with this API response is partial data
          if (personTemp && (personTemp.personId >= 0) && !arrayContains(personTemp.personId, allCachedPeopleDict)) {
            allCachedPeopleDict[personTemp.personId] = personTemp;
          }
          // console.log('allCachedPeopleDict:', allCachedPeopleDict);
          revisedState = {
            ...revisedState,
            allCachedPeopleDict,
          };
        }
        return revisedState;

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
        if (action.res.personList) {
          action.res.personList.forEach((person) => {
            // console.log('PersonStore team-retrieve adding person:', person);
            if (person && (person.id >= 0)) {
              allCachedPeopleDict[person.id] = person;
            }
          });
          // console.log('allCachedPeopleDict:', allCachedPeopleDict);
          revisedState = {
            ...revisedState,
            allCachedPeopleDict,
          };
        }
        // console.log('PersonStore revisedState:', revisedState);
        return revisedState;

      case 'person-retrieve':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.personId >= 0) {
          personId = action.res.personId;
        } else {
          personId = -1;
        }

        if (personId >= 0) {
          // console.log('PersonStore person-save personId:', personId);
          allCachedPeopleDict[personId] = action.res;
          revisedState = {
            ...revisedState,
            allCachedPeopleDict,
          };
        } else {
          console.log('PersonStore person-retrieve MISSING personId:', personId);
        }
        return revisedState;

      case 'person-save':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.personId >= 0) {
          personId = action.res.personId;
        } else {
          personId = -1;
        }

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

      case 'team-list-retrieve':
        if (!action.res.success) {
          console.log('TeamStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        teamList = action.res.teamList || [];
        revisedState = state;
        teamList.forEach((team) => {
          if (team && (team.id >= 0)) {
            if (team.teamMemberList) {
              teamMemberList = team.teamMemberList || [];
              teamMemberList.forEach((person) => {
                // console.log('PersonStore team-retrieve adding person:', person);
                if (person && (person.id >= 0) && !arrayContains(person.id, allCachedPeopleDict)) {
                  allCachedPeopleDict[person.id] = person;
                }
              });
            }
          }
        });

        revisedState = {
          ...revisedState,
          allCachedPeopleDict,
        };
        return revisedState;

      case 'team-retrieve':
      case 'team-save':
        if (!action.res.success) {
          console.log('PersonStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.teamId >= 0) {
          teamId = action.res.teamId;
        } else {
          teamId = -1;
        }

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
