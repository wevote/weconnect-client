import React, { useEffect, useRef } from 'react';
import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';


const AddPersonForm = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonForm');
  const { getAppContextValue } = useConnectAppContext();

  const [teamId, setTeamId] = React.useState(-1);
  const [teamName, setTeamName] = React.useState('');
  const [mutateFired, setMutateFired] = React.useState(false);

  const queryClient = useQueryClient();
  const firstNameFldRef = useRef('');
  const lastNameFldRef = useRef('');
  const emailFldRef = useRef('');

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('AddPersonForm: Context value changed:', true);
    setTeamId(getAppContextValue('addPersonDrawerTeam').id);
    setTeamName(getAppContextValue('addPersonDrawerTeam').teamName);
  }, [getAppContextValue]);

  const saveNewPersonMutation = useMutation({
    mutationFn: (params) => weConnectQueryFn(['person-save'], params),
    onSuccess: () => {
      console.log('--------- saveNewPersonMutation  mutated before invalidate ---------');
      queryClient.invalidateQueries(['team-list-retrieve']).then(() => {});
    },
    onError: (err) => { console.log('saveNewPersonMutation error: ', err); },
  });

  if (saveNewPersonMutation.isSuccess && mutateFired) {   // do we need this??????????
    setMutateFired(false);
    console.log('--------- saveNewPersonMutation mutated on success ---------');
  }

  const makeSavePersonDict = (data) => {
    let requestParams = '';
    // for (const key in activePerson) {
    Object.keys(data).forEach((key) => {
      requestParams += `${key}ToBeSaved=${data[key]}&`;
      requestParams += `${key}Changed=${true}&`;
    });
    requestParams += `personId=-1&teamId=${teamId}&teamName=${teamName}`;
    return encodeURI(requestParams);
  };

  const saveNewPerson = () => {
    const data = {
      firstName: firstNameFldRef.current.value,
      lastName: lastNameFldRef.current.value,
      emailPersonal: emailFldRef.current.value,
    };
    const requestParams = makeSavePersonDict(data);
    // http://localhost:4500/apis/v1/person-save/?personId=-1&emailPersonalChanged=true&emailPersonalToBeSaved=steve%40podell.com&firstNameChanged=true&firstNameToBeSaved=Steve&lastNameChanged=true&lastNameToBeSaved=Podell&teamId=1&teamName=Levi
    setMutateFired(true);
    saveNewPersonMutation.mutate(requestParams);
  };

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
          inputRef={firstNameFldRef}
          placeholder="First Name"
        />
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          id="lastNameToBeSaved"
          label="Last Name"
          name="lastNameToBeSaved"
          margin="dense"
          variant="outlined"
          inputRef={lastNameFldRef}
          placeholder="Last Name"
        />
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          id="emailPersonalToBeSaved"
          label="Email Address, Personal"
          name="emailPersonalToBeSaved"
          margin="dense"
          variant="outlined"
          placeholder="Email Address, Personal"
          inputRef={emailFldRef}
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
