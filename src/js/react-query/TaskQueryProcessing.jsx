// allCachedTaskGroupsDict: {}, // This is a dictionary key: taskGroupId, value: TaskGroup dict
// allCachedTaskDefinitionsDict: {}, // This is a dictionary key: taskDefinitionId, value: TaskDefinition dict
// allCachedTasksDict: {}, // This is a dictionary key: personId, value: another dictionary key: taskDefinitionId, value: Task dict


const personListRetrieve = (data, teamId) => {
  const personListRaw = data.personList;

  const personList = [];
  let personFiltered;
  let personRaw;
  for (let i = 0; i < personListRaw.length; i++) {
    console.log('teamId: ', teamId);
    personRaw = personListRaw[i];
    personFiltered = personRaw;
    personList.push(personFiltered);
  }
  return personList;
};

export default personListRetrieve;
