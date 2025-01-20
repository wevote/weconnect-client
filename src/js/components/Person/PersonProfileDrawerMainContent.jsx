import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import QuestionnaireResponsesList from '../Questionnaire/QuestionnaireResponsesList';
import PersonProfile from './PersonProfile';


// eslint-disable-next-line no-unused-vars
const PersonProfileDrawerMainContent = ({ classes }) => {
  renderLog('PersonProfileDrawerMainContent');

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile />
      <QuestionnaireResponsesList />
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
