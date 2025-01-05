import React from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditTaskDefinitionDrawerMainContent from '../Task/EditTaskDefinitionDrawerMainContent';


const EditTaskDefinitionDrawer = () => {
  renderLog('EditTaskDefinitionDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);

  const onAppObservableStoreChange = () => {
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editTaskDefinitionDrawerTaskDefinitionId');
    if (questionnaireIdTemp >= 0) {
      setHeaderTitleJsx(<>Edit Task</>);
    } else {
      setHeaderTitleJsx(<>Add Task</>);
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
      drawerId="editTaskDefinitionDrawer"
      drawerOpenGlobalVariableName="editTaskDefinitionDrawerOpen"
      mainContentJsx={<EditTaskDefinitionDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditTaskDefinitionDrawer.propTypes = {
};

export default EditTaskDefinitionDrawer;
