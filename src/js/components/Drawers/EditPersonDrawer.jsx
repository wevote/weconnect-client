import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditPersonDrawerMainContent from '../Person/EditPersonDrawerMainContent';

// eslint-disable-next-line no-unused-vars
const EditPersonDrawer = ({ classes }) => {
  renderLog('EditPersonDrawer');

  const [headerTitleJsx] = React.useState(<></>);
  const [headerFixedJsx] = React.useState(<></>);


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
EditPersonDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

// const EditPersonDrawerWrapper = styled('div')`
// `;

export default withStyles(styles)(EditPersonDrawer);
