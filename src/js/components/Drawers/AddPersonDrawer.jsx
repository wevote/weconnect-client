import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import AddPersonDrawerMainContent from '../Person/AddPersonDrawerMainContent';


// eslint-disable-next-line no-unused-vars
const AddPersonDrawer = ({ classes }) => {
  renderLog('AddPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <DrawerTemplateA
      drawerId="addPersonDrawer"
      drawerOpenGlobalVariableName="addPersonDrawerOpen"
      mainContentJsx={<AddPersonDrawerMainContent />}
      headerTitleJsx={<>Add Team Member</>}
      headerFixedJsx={<></>}
    />
  );
};
AddPersonDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

export default withStyles(styles)(AddPersonDrawer);
