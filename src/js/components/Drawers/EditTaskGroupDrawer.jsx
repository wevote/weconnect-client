import React from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditTaskGroupDrawerMainContent from '../Task/EditTaskGroupDrawerMainContent';


const EditTaskGroupDrawer = () => {
  renderLog('EditTaskGroupDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);

  const onAppObservableStoreChange = () => {
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editTaskGroupDrawerTaskGroupId');
    if (questionnaireIdTemp >= 0) {
      setHeaderTitleJsx(<>Edit Task Grouping</>);
    } else {
      setHeaderTitleJsx(<>Add Task Grouping</>);
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
    };
  }, []);

  return (
    <DrawerTemplateA
      drawerId="editTaskGroupDrawer"
      drawerOpenGlobalVariableName="editTaskGroupDrawerOpen"
      mainContentJsx={<EditTaskGroupDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditTaskGroupDrawer.propTypes = {
};

export default EditTaskGroupDrawer;
