import React, { useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import EditPersonDrawerMainContent from '../Person/EditPersonDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';

const EditPersonDrawer = () => {
  renderLog('EditPersonDrawer');

  const [headerTitleJsx] = useState(<></>);
  const [headerFixedJsx] = useState(<></>);


  return (
    <DrawerTemplateA
      drawerId="editPersonDrawer"
      drawerOpenGlobalVariableName="editPersonDrawerOpen"
      mainContentJsx={<EditPersonDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};

export default EditPersonDrawer;
