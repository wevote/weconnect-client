import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import prepareDataPackageFromAppObservableStore from '../../common/utils/prepareDataPackageFromAppObservableStore';

const FIELDS_IN_FORM = ['emailPersonal', 'firstName', 'lastName'];

const AddPersonForm = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [emailPersonal, setEmailPersonal] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [teamId, setTeamId] = React.useState(-1);

  const onAppObservableStoreChange = () => {
    setTeamId(AppObservableStore.getGlobalVariableState('addPersonDrawerTeamId'));
  };

  const saveNewPersonSuccessful = () => {
    AppObservableStore.setGlobalVariableState('addPersonDrawerOpen', false);
    AppObservableStore.setGlobalVariableState('addPersonDrawerTeamId', -1);
    for (let i = 0; i < FIELDS_IN_FORM.length; i++){
      const fieldName = FIELDS_IN_FORM[i];
      AppObservableStore.setGlobalVariableState(`${fieldName}Changed`, false);
      AppObservableStore.setGlobalVariableState(`${fieldName}ToBeSaved`, '');
    }
  };

  const onPersonStoreChange = () => {
    const mostRecentPersonChanged = PersonStore.getMostRecentPersonChanged();
    // console.log('AddPersonForm onPersonStoreChange mostRecentPersonChanged:', mostRecentPersonChanged);
    // TODO: Figure out why firstName, lastName, and emailPersonal are not being updated
    // console.log('firstName:', firstName, ', lastName:', lastName, ', emailPersonal:', emailPersonal);
    // console.log('emailPersonalToBeSaved:', AppObservableStore.getGlobalVariableState('emailPersonalToBeSaved'));
    if (mostRecentPersonChanged.emailPersonal === AppObservableStore.getGlobalVariableState('emailPersonalToBeSaved')) {
      saveNewPersonSuccessful();
    }
  };

  const saveNewPerson = () => {
    const data = prepareDataPackageFromAppObservableStore(FIELDS_IN_FORM);
    if (teamId >= 0) {
      data.teamId = teamId;
      data.teamName = TeamStore.getTeamById(teamId).teamName;
    }
    // console.log('saveNewPerson data:', data);
    PersonActions.personSave('-1', data);
  };

  const updateEmailPersonal = (event) => {
    if (event.target.name === 'emailPersonalToBeSaved') {
      const newEmailPersonal = event.target.value;
      AppObservableStore.setGlobalVariableState('emailPersonalChanged', true);
      AppObservableStore.setGlobalVariableState('emailPersonalToBeSaved', newEmailPersonal);
      // console.log('updateEmailPersonal:', newEmailPersonal);
      setEmailPersonal(newEmailPersonal);
    }
  };

  const updateFirstName = (event) => {
    if (event.target.name === 'firstNameToBeSaved') {
      const newFirstName = event.target.value;
      AppObservableStore.setGlobalVariableState('firstNameChanged', true);
      AppObservableStore.setGlobalVariableState('firstNameToBeSaved', newFirstName);
      // console.log('updateFirstName:', newFirstName);
      setFirstName(newFirstName);
    }
  };

  const updateLastName = (event) => {
    if (event.target.name === 'lastNameToBeSaved') {
      const newLastName = event.target.value;
      AppObservableStore.setGlobalVariableState('lastNameChanged', true);
      AppObservableStore.setGlobalVariableState('lastNameToBeSaved', newLastName);
      // console.log('updateLastName:', newLastName);
      setLastName(newLastName);
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    // console.log('Initial load emailPersonalToBeSaved:', AppObservableStore.getGlobalVariableState('emailPersonalToBeSaved'));
    if (AppObservableStore.getGlobalVariableState('emailPersonalToBeSaved')) {
      setEmailPersonal(AppObservableStore.getGlobalVariableState('emailPersonalToBeSaved'));
    }
    if (AppObservableStore.getGlobalVariableState('firstNameToBeSaved')) {
      setFirstName(AppObservableStore.getGlobalVariableState('firstNameToBeSaved'));
    }
    if (AppObservableStore.getGlobalVariableState('lastNameToBeSaved')) {
      setLastName(AppObservableStore.getGlobalVariableState('lastNameToBeSaved'));
    }

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
    };
  }, []);

  return (
    <AddPersonFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          // classes={{ root: classes.textField }} // Not working yet
          id="firstNameToBeSaved"
          label="First Name"
          name="firstNameToBeSaved"
          margin="dense"
          variant="outlined"
          placeholder="First Name"
          value={firstName}
          onChange={updateFirstName}
        />
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          id="lastNameToBeSaved"
          label="Last Name"
          name="lastNameToBeSaved"
          margin="dense"
          variant="outlined"
          placeholder="Last Name"
          value={lastName}
          onChange={updateLastName}
        />
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          id="emailPersonalToBeSaved"
          label="Email Address, Personal"
          name="emailPersonalToBeSaved"
          margin="dense"
          variant="outlined"
          placeholder="Email Address, Personal"
          value={emailPersonal}
          onBlur={updateEmailPersonal}
          onChange={updateEmailPersonal}
        />
        <Button
          classes={{ root: classes.saveNewPersonButton }}
          color="primary"
          variant="contained"
          onClick={saveNewPerson}
        >
          Save New Person
        </Button>
      </FormControl>
    </AddPersonFormWrapper>
  );
};
AddPersonForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveNewPersonButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AddPersonFormWrapper = styled('div')`
`;

export default withStyles(styles)(AddPersonForm);
