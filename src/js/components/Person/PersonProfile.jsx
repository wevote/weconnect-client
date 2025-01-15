import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { renderLog } from '../../common/utils/logging';
import CopyQuestionnaireLink from '../Questionnaire/CopyQuestionnaireLink';


const PersonProfile = () => {
  renderLog('PersonProfile');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();

  const person = React.useState(getAppContextValue('personProfileDrawerPerson'));

  useEffect(() => {
    setAppContextValue('QuestionnaireId', 1);
  }, []);

  return (
    <PersonProfileWrapper>
      This is the stubbed out &quot;PersonProfile.jsx&quot; resulting <br /> from &lt;PersonProfileDrawer /&gt;
      <br />
      <br />
      <FullName>
        {`${person.firstName} ${person.lastName}`}
      </FullName>
      {/* <PersonDetails /> */}
      <CopyQuestionnaireLink />
    </PersonProfileWrapper>
  );
};
PersonProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  personId: PropTypes.number,
};

const styles = () => ({
});

const FullName = styled('div')`
`;

const PersonProfileWrapper = styled('div')`
`;

export default withStyles(styles)(PersonProfile);
