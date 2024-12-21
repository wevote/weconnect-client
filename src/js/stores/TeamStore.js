import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';
import PersonStore from './PersonStore';
import arrayContains from '../common/utils/arrayContains';

class TeamStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedTeamsDict: {}, // This is a dictionary key: teamId, value: team dict
      allCachedTeamMembersDict: {}, // This is a dictionary key: teamId, value: list of personIds in the team
      mostRecentTeamIdSaved: -1,
      mostRecentTeamMemberIdSaved: -1,
      mostRecentTeamSaved: {
        teamName: '',
        teamId: '',
      },
    };
  }

  getMostRecentTeamChanged () {
    console.log('TeamStore getMostRecentTeamChanged Id:', this.getState().mostRecentTeamIdSaved);
    if (this.getState().mostRecentTeamIdSaved !== -1) {
      return this.getTeamById(this.getState().mostRecentTeamIdSaved);
    }
    return {};
  }

  getTeamById (teamId) {
    const { allCachedTeamsDict } = this.getState();
    // console.log('TeamStore getTeamById:', teamId, ', allCachedTeamsDict:', allCachedTeamsDict);
    return allCachedTeamsDict[teamId] || {};
  }

  getTeamList () {
    const { allCachedTeamsDict } = this.getState();
    const teamListRaw = Object.values(allCachedTeamsDict);

    const teamList = [];
    let teamFiltered;
    let teamRaw;
    for (let i = 0; i < teamListRaw.length; i++) {
      teamRaw = teamListRaw[i];
      // console.log('TeamStore getTeamMemberList person:', person);
      teamFiltered = teamRaw;
      teamList.push(teamFiltered);
    }
    return teamList;
  }

  getTeamMemberList (teamId) {
    const { allCachedTeamMembersDict } = this.getState();
    // console.log('TeamStore getTeamMemberList teamId:', teamId, ', allCachedTeamMembersDict:', allCachedTeamMembersDict);
    const personIdList = allCachedTeamMembersDict[teamId] || [];
    const teamMemberList = [];
    for (let i = 0; i < personIdList.length; i++) {
      const person = PersonStore.getPersonById(personIdList[i]);
      // console.log('TeamStore getTeamMemberList person:', person);
      if (person) {
        teamMemberList.push(person);
      }
    }
    return teamMemberList;
  }

  getTeamMemberPersonIdList (teamId) {
    const { allCachedTeamMembersDict } = this.getState();
    return allCachedTeamMembersDict[teamId] || [];
  }

  getTeamName (teamId) {
    const team = this.getTeamById(teamId);
    return team.teamName || '';
  }

  reduce (state, action) {
    const { allCachedTeamMembersDict, allCachedTeamsDict } = state;
    let personId = -1;
    let revisedState = state;
    let teamId = -1;
    let teamList = [];
    let teamMemberList = [];
    let teamMemberIdList = [];

    switch (action.type) {
      case 'add-person-to-team':
        if (!action.res.success) {
          console.log('TeamStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('TeamStore add-person-to-team action.res: ', action.res);
        if (action.res.personId >= 0) {
          personId = action.res.personId;
        } else {
          personId = -1;
        }
        if (action.res.teamId >= 0) {
          teamId = action.res.teamId;
        } else {
          teamId = -1;
        }
        if (personId >= 0 && teamId >= 0) {
          // console.log('TeamStore add-person-to-team personId: ', personId, ', teamId:', teamId);
          // Start with existing teamMemberList
          teamMemberIdList = allCachedTeamMembersDict[teamId] || [];
          // Check if personId is already in teamMemberListAdd personId to teamMemberList
          if (!arrayContains(personId, teamMemberIdList)) {
            teamMemberIdList.push(personId);
            allCachedTeamMembersDict[teamId] = teamMemberIdList;
            revisedState = {
              ...revisedState,
              allCachedTeamMembersDict,
              mostRecentTeamMemberIdSaved: personId,
            };
          }
        } else {
          console.log('TeamStore add-person-to-team MISSING personId: ', personId, ' OR teamId:', teamId);
        }

        return revisedState;

      case 'remove-person-from-team':
        if (!action.res.success) {
          console.log('TeamStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('TeamStore add-person-to-team action.res: ', action.res);
        if (action.res.personId >= 0) {
          personId = action.res.personId;
        } else {
          personId = -1;
        }
        if (action.res.teamId >= 0) {
          teamId = action.res.teamId;
        } else {
          teamId = -1;
        }
        if (personId >= 0 && teamId >= 0) {
          // console.log('TeamStore remove-person-from-team personId: ', personId, ', teamId:', teamId);
          // Start with existing teamMemberList
          teamMemberIdList = allCachedTeamMembersDict[teamId] || [];
          // If personId is in teamMemberListAdd, remove it
          if (arrayContains(personId, teamMemberIdList)) {
            teamMemberIdList = teamMemberIdList.filter((item) => item !== personId);
            allCachedTeamMembersDict[teamId] = teamMemberIdList;
            revisedState = {
              ...revisedState,
              allCachedTeamMembersDict,
              mostRecentTeamMemberIdSaved: personId,
            };
          }
        } else {
          console.log('TeamStore remove-person-from-team MISSING personId: ', personId, ' OR teamId:', teamId);
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
            allCachedTeamsDict[team.id] = team;
            if (team.teamMemberList) {
              teamMemberIdList = [];
              teamMemberList = team.teamMemberList || [];
              teamMemberList.forEach((person) => {
                if (person && (person.id >= 0) && !arrayContains(person.id, teamMemberIdList)) {
                  teamMemberIdList.push(person.id);
                }
              });
              allCachedTeamMembersDict[team.id] = teamMemberIdList;
            }
          }
        });

        revisedState = {
          ...revisedState,
          allCachedTeamMembersDict,
          allCachedTeamsDict,
        };
        return revisedState;

      case 'team-retrieve':
        if (!action.res.success) {
          console.log('TeamStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        if (action.res.teamId >= 0) {
          teamId = action.res.teamId;
        } else {
          teamId = -1;
        }
        teamMemberIdList = [];
        revisedState = state;

        // console.log('OrganizationStore issueDescriptionsRetrieve issueList:', issueList);
        if (teamId >= 0) {
          allCachedTeamsDict[teamId] = action.res;
          if (action.res.teamMemberList) {
            // If missing teamMemberList do not alter data in the store
            teamMemberList = action.res.teamMemberList || [];
            teamMemberList.forEach((person) => {
              if (person && (person.id >= 0) && !arrayContains(person.id, teamMemberIdList)) {
                teamMemberIdList.push(person.id);
              }
            });
            allCachedTeamMembersDict[teamId] = teamMemberIdList;
            revisedState = {
              ...revisedState,
              allCachedTeamMembersDict,
            };
          }
          // console.log('allCachedTeamMembersDict:', allCachedTeamMembersDict);
          // console.log('allCachedOrganizationsDict:', allCachedOrganizationsDict);
          revisedState = {
            ...revisedState,
            allCachedTeamsDict,
          };
        }
        return revisedState;

      case 'team-save':
        if (!action.res.success) {
          console.log('TeamStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.teamId >= 0) {
          teamId = action.res.teamId;
        } else {
          teamId = -1;
        }
        if (teamId >= 0) {
          console.log('TeamStore team-save teamId:', teamId);
          allCachedTeamsDict[teamId] = action.res;
          if (action.res.teamMemberList) {
            // If missing teamMemberList do not alter data in the store
            teamMemberList = action.res.teamMemberList || [];
            teamMemberList.forEach((person) => {
              if (person && (person.id >= 0) && !arrayContains(person.id, teamMemberIdList)) {
                teamMemberIdList.push(person.id);
              }
            });
            allCachedTeamMembersDict[teamId] = teamMemberIdList;
            revisedState = {
              ...revisedState,
              allCachedTeamMembersDict,
            };
          }
          revisedState = {
            ...revisedState,
            allCachedTeamsDict,
            mostRecentTeamIdSaved: teamId,
          };
        } else {
          console.log('TeamStore person-save MISSING teamId:', teamId);
        }

        return revisedState;

      default:
        return state;
    }
  }
}

export default new TeamStore(Dispatcher);
