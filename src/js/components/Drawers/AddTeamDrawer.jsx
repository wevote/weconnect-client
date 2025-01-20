import { withStyles } from '@mui/styles';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import AddTeamDrawerMainContent from '../Team/AddTeamDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


// eslint-disable-next-line no-unused-vars
const AddTeamDrawer = () => {
  renderLog('AddTeamDrawer');
  const { getAppContextValue } = useConnectAppContext();

  return (
    <DrawerTemplateA
      drawerId="addTeamDrawer"
      drawerOpenGlobalVariableName="addTeamDrawerOpen"
      mainContentJsx={<AddTeamDrawerMainContent />}
      headerTitleJsx={getAppContextValue('AddTeamDrawerLabel')}
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
