import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { renderLog } from '../../common/utils/logging';
import PrepareDataPackageFromAppObservableStore from '../../common/utils/PrepareDataPackageFromAppObservableStore';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';

const FIELDS_IN_FORM = ['emailPersonal', 'firstName', 'lastName'];

const AddPersonForm = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonForm');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();

  const [emailPersonal, setEmailPersonal] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [teamId, setTeamId] = React.useState(-1);

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('AddPersonForm: Context value changed:', true);
    setTeamId(getAppContextValue('addPersonDrawerTeam').id);
  }, [getAppContextValue]);

  const saveNewPerson = () => {
    const data = PrepareDataPackageFromAppObservableStore(FIELDS_IN_FORM);
    if (teamId >= 0) {
      data.teamId = teamId;
      data.teamName = 'hack'; // TeamStore.getTeamById(teamId).teamName;
    }
  };

  const updateEmailPersonal = (event) => {
    if (event.target.name === 'emailPersonalToBeSaved') {
      const newEmailPersonal = event.target.value;
      setAppContextValue('emailPersonalChanged', true);
      setAppContextValue('emailPersonalToBeSaved', newEmailPersonal);
      // console.log('updateEmailPersonal:', newEmailPersonal);
      setEmailPersonal(newEmailPersonal);
    }
  };

  const updateFirstName = (event) => {
    if (event.target.name === 'firstNameToBeSaved') {
      const newFirstName = event.target.value;
      setAppContextValue('firstNameChanged', true);
      setAppContextValue('firstNameToBeSaved', newFirstName);
      // console.log('updateFirstName:', newFirstName);
      setFirstName(newFirstName);
    }
  };

  const updateLastName = (event) => {
    if (event.target.name === 'lastNameToBeSaved') {
      const newLastName = event.target.value;
      setAppContextValue('lastNameChanged', true);
      setAppContextValue('lastNameToBeSaved', newLastName);
      // console.log('updateLastName:', newLastName);
      setLastName(newLastName);
    }
  };

  React.useEffect(() => {
    console.log('Initial load emailPersonalToBeSaved:', getAppContextValue('emailPersonalToBeSaved'));
    if (getAppContextValue('emailPersonalToBeSaved')) {
      setEmailPersonal(getAppContextValue('emailPersonalToBeSaved'));
    }
    if (getAppContextValue('firstNameToBeSaved')) {
      setFirstName(getAppContextValue('firstNameToBeSaved'));
    }
    if (getAppContextValue('lastNameToBeSaved')) {
      setLastName(getAppContextValue('lastNameToBeSaved'));
    }

    return () => {
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
