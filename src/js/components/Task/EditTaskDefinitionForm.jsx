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

// const TASK_DEFINITION_FIELDS_IN_FORM = [
//   'googleDriveFolderId',
//   'isGoogleDrivePermissionStep',
//   'order',
//   'taskGroupId',
//   'taskActionUrl',
//   'taskName',
//   'taskDescription',
//   'taskInstructions',
// ];

const EditTaskDefinitionForm = ({ classes }) => {
  renderLog('EditTaskDefinitionForm');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();

  const [group] = useState(getAppContextValue('editTaskDefinitionDrawerTaskGroup'));
  const [taskDefinition] = useState(getAppContextValue('editTaskDefinitionDrawerTaskDefinition'));
  const [taskNameValue, setTaskNameValue] = useState('');
  const [taskDescValue, setTaskDescValue] = useState('');
  const [taskInstValue, setTaskInstValue] = useState('');
  const [taskUrlValue, setTaskUrlValue] = useState('');
  const [saveButtonActive, setSaveButtonActive] = useState(false);

  const queryClient = useQueryClient();
  const taskNameFldRef = useRef('');
  const taskDescFldRef = useRef('');
  const taskInstFldRef = useRef('');
  const taskUrlFldRef = useRef('');

  useEffect(() => {
    if (taskDefinition) {
      setTaskNameValue(taskDefinition.taskName);
      setTaskDescValue(taskDefinition.taskDescription);
      setTaskInstValue(taskDefinition.taskInstructions);
      setTaskUrlValue(taskDefinition.taskActionUrl);
    } else {
      setTaskNameValue('');
      setTaskDescValue('');
      setTaskInstValue('');
      setTaskUrlValue('');
    }
  }, [taskDefinition]);

  const taskDefinitionSaveMutation = useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('task-definition-save', requestParams),
    onSuccess: () => {
      queryClient.invalidateQueries('task-status-list-retrieve').then(() => {});
    },
  });

  const saveTaskDefinition = () => {
    const requestParams = makeRequestParams({
      taskDefinitionId: taskDefinition ? taskDefinition.id : '-1',
      taskGroupId: group.taskGroupId,
    }, {
      taskName: taskNameFldRef.current.value,
      taskDescription: taskDescFldRef.current.value,
      taskInstructions: taskInstFldRef.current.value,
      taskActionUrl: taskUrlFldRef.current.value,
    });
    taskDefinitionSaveMutation.mutate(requestParams);
    console.log('saveTask requestParams:', requestParams);
    setSaveButtonActive(false);
  };

  const updateSaveButton = () => {
    if (taskNameFldRef.current.value && taskNameFldRef.current.value.length &&
      taskDescFldRef.current.value && taskDescFldRef.current.value.length &&
      taskInstFldRef.current.value && taskInstFldRef.current.value.length &&
      taskUrlFldRef.current.value && taskUrlFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  return (
    <EditTaskDefinitionFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={taskNameValue}
          id="taskNameToBeSaved"
          inputRef={taskNameFldRef}
          label="Task Name"
          margin="dense"
          name="taskName"
          onChange={updateSaveButton}
          placeholder="Name of one task"
          variant="outlined"
        />
        <TextField
          defaultValue={taskDescValue}
          id="taskDescriptionToBeSaved"
          inputRef={taskDescFldRef}
          label="Description of this task"
          margin="dense"
          multiline
          name="taskDescription"
          onChange={updateSaveButton}
          placeholder="Task description"
          rows={6}
          variant="outlined"
        />
        <TextField
          defaultValue={taskInstValue}
          id="taskInstructionsToBeSaved"
          inputRef={taskInstFldRef}
          label="Instructions for completing this task"
          margin="dense"
          multiline
          name="taskInstructions"
          onChange={updateSaveButton}
          placeholder="Instructions for how to complete this task"
          rows={6}
          variant="outlined"
        />
        <TextField
          defaultValue={taskUrlValue}
          id="taskActionUrlToBeSaved"
          inputRef={taskUrlFldRef}
          label="Task Action URL"
          margin="dense"
          name="taskActionUrl"
          onChange={updateSaveButton}
          placeholder="Web address of the task"
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveTaskDefinitionButton }}
          color="primary"
          disabled={!saveButtonActive}
          onClick={saveTaskDefinition}
          variant="contained"
        >
          Save Task
        </Button>
      </FormControl>
    </EditTaskDefinitionFormWrapper>
  );
};
EditTaskDefinitionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveTaskDefinitionButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EditTaskDefinitionFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditTaskDefinitionForm);
