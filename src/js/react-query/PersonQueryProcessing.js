export const personListRetrieve = (data, teamId) => {
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

export const getFullNamePreferred = (personMember) => {
  let fullName = '';
  if (personMember.id >= 0) {
    if (personMember.firstNamePreferred) {
      fullName += personMember.firstNamePreferred;
    } else if (personMember.firstName) {
      fullName += personMember.firstName;
    }
    if (fullName.length > 0 && personMember.lastName) {
      fullName += ' ';
    }
    if (personMember.lastName) {
      fullName += personMember.lastName;
    }
  }
  return fullName;
};
