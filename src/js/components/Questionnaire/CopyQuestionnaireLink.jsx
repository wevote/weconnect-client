import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';


const CopyQuestionnaireLink = ({ personId, questionnaireId }) => {
  renderLog('CopyQuestionnaireLink');  // Set LOG_RENDER_EVENTS to log all renders
  const [fullNamePreferred, setFullNamePreferred] = React.useState('');
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [linkToBeShared, setLinkToBeShared] = React.useState('');
  const [person, setPerson] = React.useState({});

  const onAppObservableStoreChange = () => {
    // const teamIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerTeamId');
    // console.log('CopyQuestionnaireLink AppObservableStore-personProfileDrawerTeamId: ', teamIdTemp);
  };

  const onPersonStoreChange = () => {
    const personTemp = PersonStore.getPersonById(personId);
    console.log('CopyQuestionnaireLink personId:', personId, ', personTemp:', personTemp);
    setPerson(personTemp);
    const fullNamePreferredTemp = PersonStore.getFullNamePreferred(personId);
    setFullNamePreferred(fullNamePreferredTemp);
    // console.log('CopyQuestionnaireLink-onPersonStoreChange personIdTemp: ', personIdTemp);
  };

  const onTeamStoreChange = () => {
    // const teamIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerTeamId');
    // console.log('CopyQuestionnaireLink-onTeamStoreChange teamIdTemp: ', teamIdTemp);
  };

  const copyLink = () => {
    // console.log('CopyQuestionnaireLink copyLink');
    // openSnackbar({ message: 'Copied!' });
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 1500);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    // const personIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerPersonId');
    // if (apiCalming(`personRetrieve-${personIdTemp}`, 30000)) {
    //   PersonActions.personRetrieve(personIdTemp);
    // }
    setLinkToBeShared(`${webAppConfig.PROTOCOL}${webAppConfig.HOSTNAME}/q/${questionnaireId}/${personId}`);

    return () => {
      // console.log('CopyQuestionnaireLink cleanup');
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
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
  classes: PropTypes.object.isRequired,
  personId: PropTypes.number,
  questionnaireId: PropTypes.number,
};

const styles = () => ({
});

const FullName = styled('div')`
`;

const CopyQuestionnaireLinkWrapper = styled('div')`
`;

export default withStyles(styles)(CopyQuestionnaireLink);
