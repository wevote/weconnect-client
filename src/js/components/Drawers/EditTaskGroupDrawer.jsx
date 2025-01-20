import React, { useEffect, useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditTaskGroupDrawerMainContent from '../Task/EditTaskGroupDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const EditTaskGroupDrawer = () => {
  renderLog('EditTaskGroupDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();

  const [headerTitleJsx, setHeaderTitleJsx] = useState(<></>);
  const [headerFixedJsx] = useState(<></>);

  useEffect(() => {
    const group = getAppContextValue('editTaskGroupDrawerTaskGroup');
    if (group) {
      setHeaderTitleJsx(<>Add Task Grouping</>);
    } else {
      setHeaderTitleJsx(<>Edit Task Grouping</>);
    }
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
