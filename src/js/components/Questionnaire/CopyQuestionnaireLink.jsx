import { withStyles } from '@mui/styles';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { SpanWithLinkStyle } from '../Style/linkStyles';


const CopyQuestionnaireLink = () => {
  renderLog('CopyQuestionnaireLink');
  const { getAppContextValue } = useConnectAppContext();

  const [person] = useState(getAppContextValue('personDrawersPerson'));
  const [questionnaireId] = useState(getAppContextValue('QuestionnaireId'));
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkToBeShared] = useState(`${webAppConfig.PROTOCOL}${webAppConfig.HOSTNAME}/q/${questionnaireId}/${person.id}`);

  const copyLink = () => {
    // console.log('CopyQuestionnaireLink copyLink');
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 1500);
  };

  return (
    <CopyQuestionnaireLinkWrapper>
      <CopyToClipboard text={linkToBeShared} onCopy={copyLink}>
        <div>
          <div style={{ paddingBottom: '20px' }}>
            Hi {person.firstName}!
          </div>
          {linkCopied ? (
            <div>Link copied!</div>
          ) : (
            <SpanWithLinkStyle>
              copy questionnaire link
            </SpanWithLinkStyle>
          )}
        </div>
      </CopyToClipboard>
    </CopyQuestionnaireLinkWrapper>
  );
};

const styles = () => ({
});


const CopyQuestionnaireLinkWrapper = styled('div')`
`;

export default withStyles(styles)(CopyQuestionnaireLink);
