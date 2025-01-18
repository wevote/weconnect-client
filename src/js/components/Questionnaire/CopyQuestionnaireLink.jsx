import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withStyles } from '@mui/styles';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';



const CopyQuestionnaireLink = () => {
  renderLog('CopyQuestionnaireLink');
  const { getAppContextValue } = useConnectAppContext();

  const [person] = React.useState(getAppContextValue('personProfileDrawerPerson'));
  const [questionnaireId] = React.useState(getAppContextValue('QuestionnaireId'));
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [linkToBeShared] = React.useState(`${webAppConfig.PROTOCOL}${webAppConfig.HOSTNAME}/q/${questionnaireId}/${person.id}`);

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
CopyQuestionnaireLink.propTypes = {
  personId: PropTypes.number,
  questionnaireId: PropTypes.number,
};

const styles = () => ({
});


const CopyQuestionnaireLinkWrapper = styled('div')`
`;

export default withStyles(styles)(CopyQuestionnaireLink);
