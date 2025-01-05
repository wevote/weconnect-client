import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  taskDefinitionListRetrieve (taskGroupId, searchText = '') {
    // console.log('TaskActions, taskDefinitionListRetrieve searchText:', searchText);
    if (searchText) {
      Dispatcher.loadEndpoint('task-definition-list-retrieve', {
        taskGroupId,
        searchText,
      });
    } else {
      Dispatcher.loadEndpoint('task-definition-list-retrieve', {
        taskGroupId,
      });
    }
  },

  taskDefinitionSave (taskGroupId = -1, taskDefinitionId = -1, incomingData = {}) {
    // console.log('TaskActions, taskSave taskDefinitionId:', taskDefinitionId, ', incomingData:', incomingData);
    const data = {
      taskDefinitionId,
      taskGroupId,
      ...incomingData,
    };
    Dispatcher.loadEndpoint('task-definition-save', data);
  },

  taskGroupListRetrieve (searchText = '') {
    // console.log('TaskActions, taskGroupListRetrieve searchText:', searchText);
    if (searchText) {
      Dispatcher.loadEndpoint('task-group-list-retrieve', {
        searchText,
      });
    } else {
      Dispatcher.loadEndpoint('task-group-list-retrieve');
    }
  },

  taskGroupRetrieve (taskGroupId = '') {
    // console.log('TaskActions, taskGroupRetrieve taskGroupId:', taskGroupId);
    if (taskGroupId) {
      Dispatcher.loadEndpoint('task-group-retrieve', {
        taskGroupId,
      });
    } else {
      Dispatcher.loadEndpoint('task-group-retrieve');
    }
  },

  taskGroupSave (taskGroupId = -1, incomingData = {}) {
    // console.log('TaskActions, taskGroupSave taskGroupId:', taskGroupId, ', incomingData:', incomingData);
    const data = {
      taskGroupId,
      ...incomingData,
    };
    Dispatcher.loadEndpoint('task-group-save', data);
  },

  taskSave (taskGroupId = -1, taskDefinitionId = -1, incomingData = {}) {
    // console.log('TaskActions, taskSave taskDefinitionId:', taskDefinitionId, ', incomingData:', incomingData);
    const data = {
      taskDefinitionId,
      taskGroupId,
      ...incomingData,
    };
    Dispatcher.loadEndpoint('task-save', data);
  },
};
