import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import CopyQuestionnaireLink from '../Questionnaire/CopyQuestionnaireLink';


const PersonProfile = () => {
  renderLog('PersonProfile');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();

  const [person] = useState(getAppContextValue('personDrawersPerson'));

  useEffect(() => {
    setAppContextValue('QuestionnaireId', 1);
  }, []);

  return (
    <PersonProfileWrapper>
      <FullName>
        {`${person.firstName} ${person.lastName}`}
      </FullName>
      {/* <PersonDetails /> This was commented out as of January 28th, 2025 */}
      <CopyQuestionnaireLink />
    </PersonProfileWrapper>
  );
};

const FullName = styled('div')`
`;

const PersonProfileWrapper = styled('div')`
`;

export default PersonProfile;
