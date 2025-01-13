import React from 'react';
// import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import PersonProfileDrawerMainContent from '../Person/PersonProfileDrawerMainContent';


const PersonProfileDrawer = () => {
  renderLog('PersonProfileDrawer');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <DrawerTemplateA
      drawerId="personProfileDrawer"
      drawerOpenGlobalVariableName="personProfileDrawerOpen"
      mainContentJsx={<PersonProfileDrawerMainContent />}
      headerTitleJsx={<></>}
      headerFixedJsx={<></>}
    />
  );
};

const styles = () => ({
});

// const PersonProfileDrawerWrapper = styled('div')`
// `;

export default withStyles(styles)(PersonProfileDrawer);
