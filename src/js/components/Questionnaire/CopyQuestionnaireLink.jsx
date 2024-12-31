import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withStyles } from '@mui/styles';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';


const CopyQuestionnaireLink = ({ personId, questionnaireId }) => {
  renderLog('CopyQuestionnaireLink');  // Set LOG_RENDER_EVENTS to log all renders
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [linkToBeShared, setLinkToBeShared] = React.useState('');

  const copyLink = () => {
    // console.log('CopyQuestionnaireLink copyLink');
    // openSnackbar({ message: 'Copied!' });
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 1500);
  };

  React.useEffect(() => {
    setLinkToBeShared(`${webAppConfig.PROTOCOL}${webAppConfig.HOSTNAME}/q/${questionnaireId}/${personId}`);

    return () => {
      // console.log('CopyQuestionnaireLink cleanup');
    };
  }, []);

  return (
    <CopyQuestionnaireLinkWrapper>
      <CopyToClipboard text={linkToBeShared} onCopy={copyLink}>
        <div>
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
