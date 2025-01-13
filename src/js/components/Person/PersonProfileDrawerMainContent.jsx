import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { renderLog } from '../../common/utils/logging';
import PersonProfile from './PersonProfile';


// eslint-disable-next-line no-unused-vars
const PersonProfileDrawerMainContent = ({ classes }) => {
  renderLog('PersonProfileDrawerMainContent');

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile />
    </PersonProfileDrawerMainContentWrapper>
  );
};
PersonProfileDrawerMainContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

const PersonProfileDrawerMainContentWrapper = styled('div')`
`;

export default withStyles(styles)(PersonProfileDrawerMainContent);
