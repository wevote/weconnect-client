import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import TeamActions from '../../actions/TeamActions';
import TeamStore from '../../stores/TeamStore';
import { renderLog } from '../../common/utils/logging';
import PrepareDataPackageFromAppObservableStore from '../../common/utils/PrepareDataPackageFromAppObservableStore';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';

const AddTeamForm = ({ classes }) => {  //  classes, teamId
  renderLog('AddTeamForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [teamName, setTeamName] = React.useState('');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes


  const saveNewTeamSuccessful = () => {
    setAppContextValue('addTeamDrawerOpen', false);
    setAppContextValue('teamNameChanged', false);
    setAppContextValue('teamNameToBeSaved', '');
  };

  const onTeamStoreChange = () => {
    const mostRecentTeamChanged = TeamStore.getMostRecentTeamChanged();
    // console.log('AddTeamForm onTeamStoreChange mostRecentTeamChanged:', mostRecentTeamChanged);
    // TODO: Figure out why teamName is not being updated locally
    // console.log('teamName:', teamName);
    if (mostRecentTeamChanged.teamName === getAppContextValue('teamNameToBeSaved')) {
      saveNewTeamSuccessful();
    }
  };

  const saveNewTeam = () => {
    const acceptedVariables = ['teamName'];
    const data = PrepareDataPackageFromAppObservableStore(acceptedVariables);
    // console.log('saveNewTeam data:', data);
    TeamActions.teamSave('-1', data);
  };

  const updateTeamName = (event) => {
    if (event.target.name === 'teamNameToBeSaved') {
      const newTeamName = event.target.value;
      setAppContextValue('teamNameChanged', true);
      setAppContextValue('teamNameToBeSaved', newTeamName);
      // console.log('updateTeamName:', newTeamName);
      setTeamName(newTeamName);
    }
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();
    if (getAppContextValue('teamNameToBeSaved')) {
      setTeamName(getAppContextValue('teamNameToBeSaved'));
    }

    return () => {
      // appStateSubscription.unsubscribe();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <AddTeamFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          // classes={{ root: classes.textField }} // Not working yet
          id="teamNameToBeSaved"
          label="Team Name"
          name="teamNameToBeSaved"
          margin="dense"
          onChange={updateTeamName}
          placeholder="Team Name"
          value={teamName}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveNewTeamButton }}
          color="primary"
          onClick={saveNewTeam}
          variant="contained"
        >
          Save New Team
        </Button>
      </FormControl>
    </AddTeamFormWrapper>
  );
};
AddTeamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveNewTeamButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AddTeamFormWrapper = styled('div')`
`;

export default withStyles(styles)(AddTeamForm);
