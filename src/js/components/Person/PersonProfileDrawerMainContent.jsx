import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { renderLog } from '../../common/utils/logging';
import PersonProfile from './PersonProfile';
import QuestionnaireResponsesList from '../Questionnaire/QuestionnaireResponsesList';


// eslint-disable-next-line no-unused-vars
const PersonProfileDrawerMainContent = ({ classes }) => {
  renderLog('PersonProfileDrawerMainContent');

  /* HACK 1/14/25 to get compile */
  const personIdTemp = 1;
  // End Hack

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile />
      <PersonProfile personId={personIdTemp} />
      <QuestionnaireResponsesList personId={personIdTemp} />
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
