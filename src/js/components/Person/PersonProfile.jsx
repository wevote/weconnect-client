import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import CopyQuestionnaireLink from '../Questionnaire/CopyQuestionnaireLink';


const PersonProfile = ({ personId }) => {
  renderLog('PersonProfile');  // Set LOG_RENDER_EVENTS to log all renders
  const [person, setPerson] = React.useState({});
  const [fullNamePreferred, setFullNamePreferred] = React.useState('');

  const onAppObservableStoreChange = () => {
    // const teamIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerTeamId');
    // console.log('PersonProfile AppObservableStore-personProfileDrawerTeamId: ', teamIdTemp);
  };

  const onPersonStoreChange = () => {
    const personTemp = PersonStore.getPersonById(personId);
    // console.log('PersonProfile personId:', personId, ', personTemp:', personTemp);
    setPerson(personTemp);
    const fullNamePreferredTemp = PersonStore.getFullNamePreferred(personId);
    setFullNamePreferred(fullNamePreferredTemp);
    // console.log('PersonProfile-onPersonStoreChange personIdTemp: ', personIdTemp);
  };

  const onTeamStoreChange = () => {
    // const teamIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerTeamId');
    // console.log('PersonProfile-onTeamStoreChange teamIdTemp: ', teamIdTemp);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    const personIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerPersonId');
    if (apiCalming(`personRetrieve-${personIdTemp}`, 30000)) {
      PersonActions.personRetrieve(personIdTemp);
    }

    return () => {
      // console.log('PersonProfile cleanup');
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <PersonProfileWrapper>
      <FullName>
        {fullNamePreferred}
      </FullName>
      {/* <PersonDetails person={person} /> */}
      <CopyQuestionnaireLink personId={personId} questionnaireId={1} />
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
