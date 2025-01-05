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

const TASK_GROUP_FIELDS_IN_FORM = [
  'taskGroupName', 'taskGroupDescription', 'taskGroupIsForTeam'];

const EditTaskGroupForm = ({ classes }) => {
  renderLog('EditTaskGroupForm');  // Set LOG_RENDER_EVENTS to log all renders
  const [firstTaskGroupDataReceived, setFirstTaskGroupDataReceived] = React.useState(false);
  const [inputValues, setInputValues] = React.useState({});
  // const [taskGroupId, setTaskGroupId] = React.useState(-1);
  // const [taskGroupDictAlreadySaved, setTaskGroupDictAlreadySaved] = React.useState({});
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const clearEditFormValuesInAppObservableStore = () => {
    const globalVariableStates = {};
    for (let i = 0; i < TASK_GROUP_FIELDS_IN_FORM.length; i++) {
      const fieldName = TASK_GROUP_FIELDS_IN_FORM[i];
      globalVariableStates[`${fieldName}Changed`] = false;
      globalVariableStates[`${fieldName}ToBeSaved`] = '';
    }
    globalVariableStates.editTaskGroupDrawerTaskGroupId = -1;
    // console.log('clearEditFormValuesInAppObservableStore globalVariableStates:', globalVariableStates);
    AppObservableStore.setGlobalVariableStateInBulk(globalVariableStates);
  };

  const clearEditedValues = () => {
    setInputValues({});
    setFirstTaskGroupDataReceived(false);
    // setTaskGroupId(-1);
    clearEditFormValuesInAppObservableStore();
    AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', false);
  };

  const updateInputValuesFromTaskStore = (inputValuesIncoming) => {
    const revisedInputValues = { ...inputValuesIncoming };
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskGroupDrawerTaskGroupId');
    const taskGroupDict = TaskStore.getTaskGroupById(taskGroupIdTemp) || {};
    // console.log('=== updateInputValuesFromTaskStore taskGroupIdTemp:', taskGroupIdTemp, ', taskGroupDict:', taskGroupDict);
    if (taskGroupIdTemp && taskGroupDict.taskGroupId) {
      // console.log('taskGroupIdTemp:', taskGroupIdTemp, ', taskGroupDict.taskGroupId:', taskGroupDict.taskGroupId);
      // setTaskGroupDictAlreadySaved(taskGroupDict);
      for (let i = 0; i < TASK_GROUP_FIELDS_IN_FORM.length; i++) {
        const fieldName = TASK_GROUP_FIELDS_IN_FORM[i];
        revisedInputValues[fieldName] = taskGroupDict[fieldName];
      }
    }
    return revisedInputValues;
  };

  const onAppObservableStoreChange = () => {
    const editTaskGroupDrawerOpenTemp = AppObservableStore.getGlobalVariableState('editTaskGroupDrawerOpen');
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskGroupDrawerTaskGroupId');
    if (taskGroupIdTemp >= 0 && !editTaskGroupDrawerOpenTemp) {
      clearEditedValues();
    }
  };

  const onTaskStoreChange = () => {
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskGroupDrawerTaskGroupId');
    const taskGroupDict = TaskStore.getTaskGroupById(taskGroupIdTemp) || {};
    if (!firstTaskGroupDataReceived) {
      if (taskGroupIdTemp && taskGroupDict.taskGroupId) {
        const inputValuesRevised = updateInputValuesFromTaskStore(inputValues);
        setFirstTaskGroupDataReceived(true);
        setInputValues(inputValuesRevised);
      }
    }
  };

  const saveTaskGroup = () => {
    const taskGroupIdTemp = AppObservableStore.getGlobalVariableState('editTaskGroupDrawerTaskGroupId');
    const data = prepareDataPackageFromAppObservableStore(TASK_GROUP_FIELDS_IN_FORM);
    // console.log('saveTaskGroup data:', data);
    TaskActions.taskGroupSave(taskGroupIdTemp, data);
    setSaveButtonActive(false);
    setTimeout(() => {
      clearEditedValues();
    }, 250);
  };

  const updateTaskGroupField = (event) => {
    if (event.target.name) {
      const newValue = event.target.value || '';
      AppObservableStore.setGlobalVariableState(`${event.target.name}Changed`, true);
      AppObservableStore.setGlobalVariableState(`${event.target.name}ToBeSaved`, newValue);
      // console.log('updateTaskGroupField:', event.target.name, ', newValue:', newValue);
      setInputValues({ ...inputValues, [event.target.name]: newValue });
      setSaveButtonActive(true);
    } else {
      console.error('updateTaskGroupField Invalid event:', event);
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
    <EditTaskGroupFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          id="taskGroupNameToBeSaved"
          label="Task Grouping Name"
          name="taskGroupName"
          margin="dense"
          onChange={updateTaskGroupField}
          placeholder="Name of sequence of tasks"
          value={inputValues.taskGroupName || ''}
          variant="outlined"
        />
        <TextField
          id="taskGroupDescriptionToBeSaved"
          label="Description of this task grouping"
          margin="dense"
          multiline
          name="taskGroupDescription"
          onChange={updateTaskGroupField}
          placeholder="Task grouping description"
          rows={6}
          value={inputValues.taskGroupDescription || ''}
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
