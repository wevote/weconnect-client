import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';
import Cookies from '../common/utils/js-cookie/Cookies';
import PersonStore from './PersonStore';
import arrayContains from '../common/utils/arrayContains';

class TeamStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedTeamsDict: {}, // This is a dictionary key: teamId, value: team dict
      allCachedTeamMembersDict: {}, // This is a dictionary key: teamId, value: list of personIds in the team
      // team: {
      //   teamName: '',
      //   description: '',
      //   personDeviceId: '',
      //   statusActive: false,
      // },
    };
  }

  getTeamById (teamId) {
    const { allCachedTeamsDict } = this.getState();
    return allCachedTeamsDict[teamId] || {};
  }

  getTeamDeviceId () {
    return this.getState().person.personDeviceId || Cookies.get('personDeviceId');
  }

  getTeamMemberList (teamId) {
    const { allCachedTeamMembersDict } = this.getState();
    const personIdList = allCachedTeamMembersDict[teamId] || [];
    const teamMemberList = [];
    for (let i = 0; i < personIdList.length; i++) {
      const person = PersonStore.getPersonById(personIdList[i]);
      if (person) {
        teamMemberList.push(person);
      }
    }
    return teamMemberList;
  }

  reduce (state, action) {
    const { allCachedTeamMembersDict } = state;
    let revisedState = state;
    let teamId = -1;
    let teamMemberList = [];
    let teamMemberIdList = [];

    switch (action.type) {
      case 'clearEmailAddressStatus':
        // console.log('VoterStore clearEmailAddressStatus');
        return { ...state, emailAddressStatus: {} };

      case 'team-retrieve':
        if (!action.res.success) {
          console.log('TeamStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        teamId = action.res.teamId || -1;
        teamMemberList = action.res.teamMemberList || [];
        teamMemberIdList = [];
        revisedState = state;

        // console.log('OrganizationStore issueDescriptionsRetrieve issueList:', issueList);
        if (teamId > 0) {
          teamMemberList.forEach((person) => {
            if (person && (person.id >= 0) && !arrayContains(person.id, teamMemberIdList)) {
              teamMemberIdList.push(person.id);
            }
          });
          allCachedTeamMembersDict[teamId] = teamMemberIdList;
          console.log('allCachedTeamMembersDict:', allCachedTeamMembersDict);
          // console.log('allCachedOrganizationsDict:', allCachedOrganizationsDict);
          revisedState = {
            ...revisedState,
            allCachedTeamMembersDict,
          };
        }
        return revisedState;

      default:
        return state;
    }
  }
}

export default new TeamStore(Dispatcher);
