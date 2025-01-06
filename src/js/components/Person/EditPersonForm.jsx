import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import PersonActions from '../../actions/PersonActions';
import PersonStore from '../../stores/PersonStore';
import { renderLog } from '../../common/utils/logging';
import PrepareDataPackageFromAppObservableStore from '../../common/utils/PrepareDataPackageFromAppObservableStore';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';

const PERSON_FIELDS_IN_FORM = [
  'emailPersonal', 'firstName', 'firstNamePreferred', 'jobTitle', 'lastName',
  'location'];

const EditPersonForm = ({ classes }) => {  //  classes, teamId
  renderLog('EditPersonForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [firstPersonDataReceived, setFirstPersonDataReceived] = React.useState(false);
  const [inputValues, setInputValues] = React.useState({});
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);
  const { setAppContextValue, getAppContextValue, setAppContextValuesInBulk } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes

  // const [personId, setPersonId] = React.useState(-1);
  // const [personDictAlreadySaved, setPersonDictAlreadySaved] = React.useState({});


  const clearEditFormValuesInAppObservableStore = () => {
    const globalVariableStates = {};
    for (let i = 0; i < PERSON_FIELDS_IN_FORM.length; i++) {
      const fieldName = PERSON_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editPersonDrawerPersonId = -1;
    globalVariableStates.editPersonDrawerTeamId = -1;
    // console.log('clearEditFormValuesInAppObservableStore globalVariableStates:', globalVariableStates);
    setAppContextValuesInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstPersonDataReceived(false);
    // setPersonId(-1);
    clearEditFormValuesInAppObservableStore();
    setAppContextValue('editPersonDrawerOpen', false);
  };

  const updateInputValuesFromPersonStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
    const personDict = PersonStore.getPersonById(personIdTemp) || {};
    // console.log('updateInputValuesFromPersonStore personDict:', personDict);
    if (personIdTemp && personDict.personId) {
      // setPersonDictAlreadySaved(personDict);
      for (let i = 0; i < PERSON_FIELDS_IN_FORM.length; i++) {
        const fieldName = PERSON_FIELDS_IN_FORM[i];
        revisedInputValues[fieldName] = personDict[fieldName];
      }
    }
    return revisedInputValues;
  };

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditPersonForm: Context value changed:', true);
    const editPersonDrawerOpenTemp = getAppContextValue('editPersonDrawerOpen');
    const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
    if (personIdTemp >= 0 && !editPersonDrawerOpenTemp) {
      clearEditedValues();
    }
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   const editPersonDrawerOpenTemp = getAppContextValue('editPersonDrawerOpen');
  //   const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
  //   if (personIdTemp >= 0 && !editPersonDrawerOpenTemp) {
  //     clearEditedValues();
  //   }
  // };

  const onPersonStoreChange = () => {
    const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
    const personDict = PersonStore.getPersonById(personIdTemp) || {};
    if (!firstPersonDataReceived) {
      if (personIdTemp && personDict.personId) {
        const inputValuesRevised = updateInputValuesFromPersonStore(inputValues);
        setFirstPersonDataReceived(true);
        setInputValues(inputValuesRevised);
      }
    }
  };

  const savePerson = () => {
    const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
    const data = PrepareDataPackageFromAppObservableStore(PERSON_FIELDS_IN_FORM);
    // console.log('savePerson data:', data);
    PersonActions.personSave(personIdTemp, data);
    setSaveButtonActive(false);
    setTimeout(() => {
      clearEditedValues();
    }, 250);
  };

  const updatePersonField = (event) => {
    // The input name must match the person field being updated
    if (event.target.name) {
      const newValue = event.target.value || '';
      setAppContextValue(`${event.target.name}Changed`, true);
      setAppContextValue(`${event.target.name}ToBeSaved`, newValue);
      // console.log('updatePersonField:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updatePersonField Invalid event:', event);
    }
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();

    return () => {
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
    };
  }, []);

  return (
    <EditPersonFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="firstNameToBeSaved"
          label="First (Legal) Name"
          margin="dense"
          name="firstName"
          onChange={updatePersonField}
          placeholder="First Name (legal name)"
          value={inputValues.firstName || ''}
          variant="outlined"
        />
        <TextField
          id="firstNamePreferredToBeSaved"
          label="Preferred  Name (if different from legal)"
          name="firstNamePreferred"
          margin="dense"
          variant="outlined"
          placeholder="First Name you want used in meetings"
          value={inputValues.firstNamePreferred || ''}
          onChange={updatePersonField}
        />
        <TextField
          id="lastNameToBeSaved"
          label="Last Name"
          name="lastName"
          margin="dense"
          variant="outlined"
          placeholder="Last Name"
          value={inputValues.lastName || ''}
          onChange={updatePersonField}
        />
        <TextField
          id="emailPersonalToBeSaved"
          label="Email Address, Personal"
          name="emailPersonal"
          margin="dense"
          variant="outlined"
          placeholder="Email Address, Personal"
          value={inputValues.emailPersonal || ''}
          onBlur={updatePersonField}
          onChange={updatePersonField}
        />
        <TextField
          id="locationToBeSaved"
          label="Location"
          name="location"
          margin="dense"
          variant="outlined"
          placeholder="City, State"
          value={inputValues.location || ''}
          onChange={updatePersonField}
        />
        <TextField
          id="jobTitleToBeSaved"
          label={`Job Title (at ${webAppConfig.ORGANIZATION_NAME})`}
          name="jobTitle"
          margin="dense"
          variant="outlined"
          placeholder={`Job Title here at ${webAppConfig.ORGANIZATION_NAME}`}
          value={inputValues.jobTitle || ''}
          onChange={updatePersonField}
        />
        <Button
          classes={{ root: classes.savePersonButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={savePerson}
        >
          Save Person
        </Button>
      </FormControl>
    </EditPersonFormWrapper>
  );
};
EditPersonForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  savePersonButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EditPersonFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditPersonForm);
