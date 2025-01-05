import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import TaskActions from '../../actions/TaskActions';
import TaskStore from '../../stores/TaskStore';
import { renderLog } from '../../common/utils/logging';
import prepareDataPackageFromAppObservableStore from '../../common/utils/prepareDataPackageFromAppObservableStore';

const TASK_DEFINITION_FIELDS_IN_FORM = [
  'googleDriveFolderId',
  'isGoogleDrivePermissionStep',
  'order',
  'taskGroupId',
  'taskActionUrl',
  'taskName',
  'taskDescription',
  'taskInstructions',
];

const EditTaskDefinitionForm = ({ classes }) => {
  renderLog('EditTaskDefinitionForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [firstTaskDefinitionDataReceived, setFirstTaskDefinitionDataReceived] = React.useState(false);
  const [inputValues, setInputValues] = React.useState({});
  // const [taskGroupId, setTaskDefinitionId] = React.useState(-1);
  // const [taskGroupDictAlreadySaved, setTaskDefinitionDictAlreadySaved] = React.useState({});
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const clearEditFormValuesInAppObservableStore = () => {
    const globalVariableStates = {};
    for (let i = 0; i < TASK_DEFINITION_FIELDS_IN_FORM.length; i++) {
      const fieldName = TASK_DEFINITION_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editTaskDefinitionDrawerTaskDefinitionId = -1;
    // console.log('clearEditFormValuesInAppObservableStore globalVariableStates:', globalVariableStates);
    AppObservableStore.setGlobalVariableStateInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstTaskDefinitionDataReceived(false);
    // setTaskDefinitionId(-1);
    clearEditFormValuesInAppObservableStore();
    AppObservableStore.setGlobalVariableState('editTaskDefinitionDrawerOpen', false);
  };

  const updateInputValuesFromTaskStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId');
    const taskGroupDict = TaskStore.getTaskDefinitionById(taskGroupIdTemp) || {};
    // console.log('=== updateInputValuesFromTaskStore taskGroupIdTemp:', taskGroupIdTemp, ', taskGroupDict:', taskGroupDict);
    if (taskGroupIdTemp && taskGroupDict.taskGroupId) {
      // console.log('taskGroupIdTemp:', taskGroupIdTemp, ', taskGroupDict.taskGroupId:', taskGroupDict.taskGroupId);
      // setTaskDefinitionDictAlreadySaved(taskGroupDict);
      for (let i = 0; i < TASK_DEFINITION_FIELDS_IN_FORM.length; i++) {
        const fieldName = TASK_DEFINITION_FIELDS_IN_FORM[i];
        revisedInputValues[fieldName] = taskGroupDict[fieldName];
      }
    }
    return revisedInputValues;
  };

  const onAppObservableStoreChange = () => {
    const editTaskDefinitionDrawerOpenTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerOpen');
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId');
    if (taskGroupIdTemp >= 0 && !editTaskDefinitionDrawerOpenTemp) {
      clearEditedValues();
    }
  };

  const onTaskStoreChange = () => {
    const taskDefinitionIdTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId');
    const taskDefinitionDict = TaskStore.getTaskDefinitionById(taskDefinitionIdTemp) || {};
    if (!firstTaskDefinitionDataReceived) {
      if (taskDefinitionIdTemp && taskDefinitionDict.taskDefinitionId) {
        const inputValuesRevised = updateInputValuesFromTaskStore(inputValues);
        setFirstTaskDefinitionDataReceived(true);
        setInputValues(inputValuesRevised);
      }
    }
  };

  const saveTaskDefinition = () => {
    const taskDefinitionIdTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId');
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerTaskGroupId');
    const data = prepareDataPackageFromAppObservableStore(TASK_DEFINITION_FIELDS_IN_FORM);
    // console.log('saveTaskDefinition data:', data);
    TaskActions.taskDefinitionSave(taskGroupIdTemp, taskDefinitionIdTemp, data);
    setSaveButtonActive(false);
    setTimeout(() => {
      clearEditedValues();
    }, 250);
  };

  const updateTaskDefinitionField = (event) => {
    if (event.target.name) {
      const newValue = event.target.value || '';
      AppObservableStore.setGlobalVariableState(`${event.target.name}Changed`, true);
      AppObservableStore.setGlobalVariableState(`${event.target.name}ToBeSaved`, newValue);
      // console.log('updateTaskDefinitionField:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updateTaskDefinitionField Invalid event:', event);
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = TaskStore.addListener(onTaskStoreChange);
    onTaskStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
    };
  }, []);

  return (
    <EditTaskDefinitionFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="taskNameToBeSaved"
          label="Task Name"
          name="taskName"
          margin="dense"
          onChange={updateTaskDefinitionField}
          placeholder="Name of one task"
          value={inputValues.taskName || ''}
          variant="outlined"
        />
        <TextField
          id="taskDescriptionToBeSaved"
          label="Description of this task"
          margin="dense"
          multiline
          name="taskDescription"
          onChange={updateTaskDefinitionField}
          placeholder="Task description"
          rows={6}
          value={inputValues.taskDescription || ''}
          variant="outlined"
        />
        <TextField
          id="taskInstructionsToBeSaved"
          label="Instructions for completing this task"
          margin="dense"
          multiline
          name="taskInstructions"
          onChange={updateTaskDefinitionField}
          placeholder="Instructions for how to complete this task"
          rows={6}
          value={inputValues.taskInstructions || ''}
          variant="outlined"
        />
        <TextField
          id="taskActionUrlToBeSaved"
          label="Task Action URL"
          name="taskActionUrl"
          margin="dense"
          onChange={updateTaskDefinitionField}
          placeholder="Web address of the task"
          value={inputValues.taskActionUrl || ''}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveTaskDefinitionButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={saveTaskDefinition}
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
