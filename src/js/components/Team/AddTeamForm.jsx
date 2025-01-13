import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renderLog } from '../../common/utils/logging';
import weConnectQueryFn from '../../react-query/WeConnectQuery';

/* global $  */

const AddTeamForm = ({ classes }) => {
  renderLog('AddTeamForm');

  // const [teamName, setTeamName] = React.useState('');
  const [mutateFired, setMutateFired] = React.useState(false);

  const teamNameFldRef = useRef('');
  const queryClient = useQueryClient();

  const saveTeamMutation = useMutation({
    mutationFn: (team) => weConnectQueryFn(['team-save'], {
      teamName: team,
      teamNameChanged: true,
      teamId: '-1',
    }),
    onSuccess: () => {
      console.log('--------- saveTeamMutation addTeamForm mutated ---------');
      queryClient.invalidateQueries(['team-list-retrieve']).then(() => {});
    },
  });

  if (saveTeamMutation.isSuccess && mutateFired) {
    setMutateFired(false);
    console.log('--------- saveTeamMutation mutated ---------');
  }

  const saveNewTeam = () => {
    const teamName = teamNameFldRef.current.value;
    if (teamName.length === 0) {
      $('#teamErrorLine').css('display', 'block').text('Enter a valid team name');
      return;
    }
    console.log('saveNewTeam data:', teamName);
    setMutateFired(true);
    saveTeamMutation.mutate(teamName);
  };

  return (
    <AddTeamFormWrapper>
      <div id="teamErrorLine" style={{ display: 'none', fontWeight: 800, paddingBottom: '10px' }} />
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          // classes={{ root: classes.textField }} // Not working yet
          id="teamNameToBeSaved"
          label="Team Name"
          name="teamNameToBeSaved"
          margin="dense"
          inputRef={teamNameFldRef}
          placeholder="Team Name"
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
