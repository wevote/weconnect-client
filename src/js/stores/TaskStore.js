import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';

class TaskStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedTaskGroupsDict: {}, // This is a dictionary key: taskGroupId, value: TaskGroup dict
      allCachedTaskDefinitionsDict: {}, // This is a dictionary key: taskDefinitionId, value: TaskDefinition dict
      allCachedTasksDict: {}, // This is a dictionary key: personId, value: another dictionary key: taskDefinitionId, value: Task dict
      mostRecentTaskDefinitionIdSaved: -1,
      mostRecentTaskDefinitionSaved: {
        taskDefinitionId: -1,
      },
      mostRecentTaskGroupIdSaved: -1,
      mostRecentTaskGroupSaved: {
        firstName: '',
        lastName: '',
        taskDefinitionId: -1,
      },
      taskDefinitionsCompletedPersonIdList: {}, // This is a dictionary key: taskDefinitionId, value: list of personIds who have completed the TaskDefinition
      taskGroupCompletedByPersonList: {}, // This is a dictionary key: taskGroupId, value: list of personIds who have completed the TaskGroup
      searchResults: [],
    };
  }

  getAllCachedTaskDefinitionsList () {
    const { allCachedTaskDefinitionsDict } = this.getState();
    const taskDefinitionListRaw = Object.values(allCachedTaskDefinitionsDict);

    const taskDefinitionList = [];
    let taskDefinitionFiltered;
    let taskDefinitionRaw;
    for (let i = 0; i < taskDefinitionListRaw.length; i++) {
      taskDefinitionRaw = taskDefinitionListRaw[i];
      // console.log('TaskStore getAllCachedTaskDefinitionsList taskDefinition:', taskDefinition);
      taskDefinitionFiltered = taskDefinitionRaw;
      taskDefinitionList.push(taskDefinitionFiltered);
    }
    return taskDefinitionList;
  }

  getAllCachedTaskGroupList () {
    const { allCachedTaskGroupsDict } = this.getState();
    const taskGroupListRaw = Object.values(allCachedTaskGroupsDict);

    const taskGroupList = [];
    let taskGroupFiltered;
    let taskGroupRaw;
    for (let i = 0; i < taskGroupListRaw.length; i++) {
      taskGroupRaw = taskGroupListRaw[i];
      // console.log('TaskStore getAllCachedTaskDefinitionsList taskGroup:', taskGroup);
      taskGroupFiltered = taskGroupRaw;
      taskGroupList.push(taskGroupFiltered);
    }
    return taskGroupList;
  }

  getMostRecentTaskGroupChanged () {
    // console.log('TaskStore getMostRecentTaskGroupChanged Id:', this.getState().mostRecentTaskGroupIdSaved);
    if (this.getState().mostRecentTaskGroupIdSaved !== -1) {
      return this.getTaskGroupById(this.getState().mostRecentTaskGroupIdSaved);
    }
    return {};
  }

  getMostRecentTaskGroupIdChanged () {
    // console.log('TaskStore getMostRecentTaskGroupChanged Id:', this.getState().mostRecentTaskGroupIdSaved);
    return this.getState().mostRecentTaskGroupIdSaved;
  }

  getTaskDefinitionListByTaskGroupId (taskGroupId) {
    const { allCachedTaskDefinitionsDict } = this.getState();
    const taskDefinitionListRaw = Object.values(allCachedTaskDefinitionsDict);
    const taskDefinitionListForTaskDefinition = [];
    for (let i = 0; i < taskDefinitionListRaw.length; i++) {
      if (taskDefinitionListRaw[i].taskGroupId === taskGroupId) {
        taskDefinitionListForTaskDefinition.push(taskDefinitionListRaw[i]);
      }
    }
    // console.log('TaskStore getTaskDefinitionById:', taskDefinitionId, ', taskDefinitionListForTaskDefinition:', taskDefinitionListForTaskDefinition);
    return taskDefinitionListForTaskDefinition;
  }

  getTaskGroupById (taskGroupId) {
    const { allCachedTaskGroupsDict } = this.getState();
    // console.log('TaskStore getTaskGroupById:', taskGroupId, ', allCachedTaskGroupsDict:', allCachedTaskGroupsDict);
    return allCachedTaskGroupsDict[taskGroupId] || {};
  }

  getTaskDefinitionById (taskDefinitionId) {
    const { allCachedTaskDefinitionsDict } = this.getState();
    // console.log('TaskStore getTaskDefinitionById:', taskDefinitionId, ', allCachedTaskDefinitionsDict:', allCachedTaskDefinitionsDict);
    return allCachedTaskDefinitionsDict[taskDefinitionId] || {};
  }

  getTaskById (taskId) {
    const { allCachedTasksDict } = this.getState();
    // console.log('TaskStore getTaskById:', taskId, ', allCachedTasksDict:', allCachedTasksDict);
    return allCachedTasksDict[taskId] || {};
  }

  getSearchResults () {
    // console.log('TaskStore getSearchResults:', this.getState().searchResults);
    return this.getState().searchResults || [];
  }

  reduce (state, action) {
    const {
      allCachedTaskGroupsDict, allCachedTaskDefinitionsDict,
    } = state;
    // let taskId = -1;
    let taskDefinitionId = -1;
    let revisedState = state;
    let searchResults = [];
    let taskGroupId = -1;

    switch (action.type) {
      case 'task-definition-list-retrieve':
        if (!action.res.success) {
          console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('TaskStore task-definition-list-retrieve taskDefinitionList:', action.res.taskDefinitionList);
        if (action.res.isSearching && action.res.isSearching === true) {
          // console.log('TaskStore isSearching:', action.res.isSearching);
          searchResults = action.res.taskDefinitionList;
          // console.log('TaskStore searchResults:', searchResults);
          revisedState = {
            ...revisedState,
            searchResults,
          };
        }
        if (action.res.taskDefinitionList) {
          action.res.taskDefinitionList.forEach((taskDefinition) => {
            // console.log('TaskStore task-definition-list-retrieve adding taskDefinition:', taskDefinition);
            if (taskDefinition && (taskDefinition.id >= 0)) {
              allCachedTaskDefinitionsDict[taskDefinition.id] = taskDefinition;
            }
          });
          // console.log('allCachedTaskDefinitionsDict:', allCachedTaskDefinitionsDict);
          revisedState = {
            ...revisedState,
            allCachedTaskDefinitionsDict,
          };
        }
        // console.log('TaskStore revisedState:', revisedState);
        return revisedState;

      case 'task-definition-save':
        if (!action.res.success) {
          console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.taskDefinitionId >= 0) {
          taskDefinitionId = action.res.taskDefinitionId;
        } else {
          taskDefinitionId = -1;
        }

        if (taskDefinitionId >= 0) {
          if (action.res.taskDefinitionCreated || action.res.taskDefinitionUpdated) {
            // console.log('TaskStore taskDefinition-save taskDefinitionId:', taskDefinitionId);
            allCachedTaskDefinitionsDict[taskDefinitionId] = action.res;
            revisedState = {
              ...revisedState,
              allCachedTaskDefinitionsDict,
              mostRecentTaskDefinitionIdSaved: taskDefinitionId,
            };
          } else {
            console.log('TaskStore task-definition-save NOT updated or saved.');
          }
        } else {
          console.log('TaskStore task-definition-save MISSING taskDefinitionId:', taskDefinitionId);
        }
        return revisedState;

      case 'task-group-list-retrieve':
        if (!action.res.success) {
          console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('TaskStore task-group-list-retrieve taskGroupList:', action.res.taskGroupList);
        if (action.res.isSearching && action.res.isSearching === true) {
          // console.log('TaskStore isSearching:', action.res.isSearching);
          searchResults = action.res.taskGroupList;
          // console.log('TaskStore searchResults:', searchResults);
          revisedState = {
            ...revisedState,
            searchResults,
          };
        }
        if (action.res.taskGroupList) {
          action.res.taskGroupList.forEach((taskGroup) => {
            // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
            if (taskGroup && (taskGroup.id >= 0)) {
              allCachedTaskGroupsDict[taskGroup.id] = taskGroup;
            }
          });
          // console.log('allCachedTaskGroupsDict:', allCachedTaskGroupsDict);
          revisedState = {
            ...revisedState,
            allCachedTaskGroupsDict,
          };
        }
        // console.log('TaskStore revisedState:', revisedState);
        return revisedState;

      case 'task-group-save':
        if (!action.res.success) {
          console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.taskGroupId >= 0) {
          taskGroupId = action.res.taskGroupId;
        } else {
          taskGroupId = -1;
        }

        if (taskGroupId >= 0) {
          // console.log('TaskStore task-group-save taskGroupId:', taskGroupId);
          allCachedTaskGroupsDict[taskGroupId] = action.res;
          revisedState = {
            ...revisedState,
            allCachedTaskGroupsDict,
            mostRecentTaskGroupIdSaved: taskGroupId,
          };
        } else {
          console.log('TaskStore task-group-save MISSING taskGroupId:', taskGroupId);
        }
        return revisedState;

      default:
        return state;
    }
  }
}

export default new TaskStore(Dispatcher);
