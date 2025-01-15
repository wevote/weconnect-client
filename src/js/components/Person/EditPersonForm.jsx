import React, { useRef } from 'react';
import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';

const EditPersonForm = ({ classes }) => {
  renderLog('EditPersonForm');
  const { getAppContextValue } = useConnectAppContext();

  const [saveButtonActive, setSaveButtonActive] = React.useState(false);
  const [initialPerson] = React.useState(getAppContextValue('editPersonDrawerPerson'));
  const [activePerson, setActivePerson] = React.useState({ ...initialPerson });

  const emailPersonal = useRef('');
  const firstName = useRef('');
  const firstNamePreferred = useRef('');
  const jobTitle = useRef('');
  const lastName = useRef('');
  const location = useRef('');
  const queryClient = useQueryClient();

  const personSaveMutation = useMutation({
    mutationFn: (params) => weConnectQueryFn('person-save', params),
    onSuccess: () => {
      console.log('--------- personSaveMutation  EditPersonForm mutated ---------');
      queryClient.invalidateQueries(['team-list-retrieve']).then(() => {});
    },
  });


  const makeChangedPersonDict = () => {
    let requestParams = '';
    // for (const key in activePerson) {
    Object.keys(activePerson).forEach((key) => {
      const initialValue = initialPerson[key] || '';
      const activeValue = activePerson[key] || '';
      if (initialValue !== activeValue) {
        requestParams += `${key}=${activeValue}&`;
        requestParams += `${key}Changed=${true}&`;
      }
    });
    requestParams += `personId=${activePerson.id}}&`;
    console.log('makeChangedPersonDict :', encodeURI(requestParams));
    return encodeURI(requestParams);
  };

  const savePerson = () => {
    activePerson.emailPersonal = emailPersonal.current.value;
    activePerson.firstName = firstName.current.value;
    activePerson.firstNamePreferred = firstNamePreferred.current.value;
    activePerson.jobTitle = jobTitle.current.value;
    activePerson.lastName = lastName.current.value;
    activePerson.location = location.current.value;
    setActivePerson(activePerson);

    console.log('savePerson data:', JSON.stringify(activePerson));
    const requestParams = makeChangedPersonDict();
    personSaveMutation.mutate(requestParams);
    setSaveButtonActive(false);
  };

  return (
    <EditPersonFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="firstNameToBeSaved"
          label="First (Legal) Name"
          margin="dense"
          name="firstName"
          inputRef={firstName}
          onChange={() => setSaveButtonActive(true)}
          placeholder="First Name (legal name)"
          defaultValue={activePerson.firstName || ''}
          variant="outlined"
        />
        <TextField
          id="firstNamePreferredToBeSaved"
          label="Preferred  Name (if different from legal)"
          name="firstNamePreferred"
          inputRef={firstNamePreferred}
          margin="dense"
          variant="outlined"
          placeholder="First Name you want used in meetings"
          defaultValue={activePerson.firstNamePreferred || ''}
          onChange={() => setSaveButtonActive(true)}
        />
        <TextField
          id="lastNameToBeSaved"
          label="Last Name"
          name="lastName"
          inputRef={lastName}
          margin="dense"
          variant="outlined"
          placeholder="Last Name"
          defaultValue={activePerson.lastName || ''}
          onChange={() => setSaveButtonActive(true)}
        />
        <TextField
          id="emailPersonalToBeSaved"
          label="Email Address, Personal"
          name="emailPersonal"
          inputRef={emailPersonal}
          margin="dense"
          variant="outlined"
          placeholder="Email Address, Personal"
          defaultValue={activePerson.emailPersonal || ''}
         onChange={() => setSaveButtonActive(true)}
        />
        <TextField
          id="locationToBeSaved"
          label="Location"
          name="location"
          inputRef={location}
          margin="dense"
          variant="outlined"
          placeholder="City, State"
          defaultValue={activePerson.location || ''}
          onChange={() => setSaveButtonActive(true)}
        />
        <TextField
          id="jobTitleToBeSaved"
          label={`Job Title (at ${webAppConfig.ORGANIZATION_NAME})`}
          name="jobTitle"
          inputRef={jobTitle}
          margin="dense"
          variant="outlined"
          placeholder={`Job Title here at ${webAppConfig.ORGANIZATION_NAME}`}
          defaultValue={activePerson.jobTitle || ''}
          onChange={() => setSaveButtonActive(true)}
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
