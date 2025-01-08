import React from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import AddTeamDrawerMainContent from '../Team/AddTeamDrawerMainContent';


// eslint-disable-next-line no-unused-vars
const AddTeamDrawer = () => {
  renderLog('AddTeamDrawer');


  return (
    <DrawerTemplateA
      drawerId="addTeamDrawer"
      drawerOpenGlobalVariableName="addTeamDrawerOpen"
      mainContentJsx={<AddTeamDrawerMainContent />}
      headerTitleJsx={<>Add Team</>}
      headerFixedJsx={<></>}
    />
  );
};
AddTeamDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

export default withStyles(styles)(AddTeamDrawer);
