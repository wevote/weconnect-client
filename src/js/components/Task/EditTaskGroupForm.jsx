import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import makeRequestParams from '../../common/utils/requestParamsUtils';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import weConnectQueryFn from '../../react-query/WeConnectQuery';

// const TASK_GROUP_FIELDS_IN_FORM = [
//   'taskGroupName', 'taskGroupDescription', 'taskGroupIsForTeam'];

const EditTaskGroupForm = ({ classes }) => {
  renderLog('EditTaskGroupForm');
  const { getAppContextValue } = useConnectAppContext();

  const [group] = useState(getAppContextValue('editTaskGroupDrawerTaskGroup'));
  const [groupNameValue, setGroupNameValue] = useState('');
  const [groupDescValue, setGroupDescValue] = useState('');
  const [saveButtonActive, setSaveButtonActive] = useState(false);

  const queryClient = useQueryClient();
  const groupNameFldRef = useRef('');
  const groupDescFldRef = useRef('');

  useEffect(() => {
    if (group) {
      setGroupNameValue(group.taskGroupName);
      setGroupDescValue(group.taskGroupDescription);
    } else {
      setGroupNameValue('');
      setGroupDescValue('');
    }
  }, [group]);

  const groupSaveMutation = useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('task-group-save', requestParams),
    onSuccess: () => {
      // console.log('--------- groupSaveMutation mutated --------- ');
      queryClient.invalidateQueries('task-group-retrieve').then(() => {});
    },
  });

  const saveTaskGroup = () => {
    const requestParams = makeRequestParams({
      taskGroupId: group ? group.id : '-1',
    }, {
      taskGroupName: groupNameFldRef.current.value,
      taskGroupDescription: groupDescFldRef.current.value,
    });
    groupSaveMutation.mutate(requestParams);
    console.log('saveTaskGroup requestParams:', requestParams);
    setSaveButtonActive(false);
  };

  const updateSaveButton = () => {
    if (groupNameFldRef.current.value && groupNameFldRef.current.value.length &&
      groupDescFldRef.current.value && groupDescFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  return (
    <EditTaskGroupFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={groupNameValue}
          id="taskGroupNameToBeSaved"
          inputRef={groupNameFldRef}
          label="Task Grouping Name"
          margin="dense"
          name="taskGroupName"
          onChange={() => updateSaveButton()}
          placeholder="Name of sequence of tasks"
          variant="outlined"
        />
        <TextField
          defaultValue={groupDescValue}
          id="taskGroupDescriptionToBeSaved"
          inputRef={groupDescFldRef}
          label="Description of this task grouping"
          margin="dense"
          multiline
          name="taskGroupDescription"
          onChange={() => updateSaveButton()}
          placeholder="Task grouping description"
          rows={6}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveTaskGroupButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={saveTaskGroup}
        >
          Save Task Grouping
        </Button>
      </FormControl>
    </EditTaskGroupFormWrapper>
  );
};
EditTaskGroupForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveTaskGroupButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EditTaskGroupFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditTaskGroupForm);
