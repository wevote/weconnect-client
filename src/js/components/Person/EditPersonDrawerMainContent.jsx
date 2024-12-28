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
import EditPersonForm from './EditPersonForm';


const EditPersonDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('EditPersonDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  const [teamId, setTeamId] = React.useState(-1);

  const onAppObservableStoreChange = () => {
    const teamIdTemp = AppObservableStore.getGlobalVariableState('editPersonDrawerTeamId');
    // console.log('EditPersonDrawerMainContent AppObservableStore-editPersonDrawerTeamId: ', teamIdTemp);
    setTeamId(teamIdTemp);
  };

  const onPersonStoreChange = () => {
    const personIdTemp = AppObservableStore.getGlobalVariableState('editPersonDrawerPersonId');
    const teamIdTemp = AppObservableStore.getGlobalVariableState('editPersonDrawerTeamId');
    // console.log('EditPersonDrawerMainContent personSearchResultsList:', personSearchResultsListTemp);
  };

  const onTeamStoreChange = () => {
    const teamIdTemp = AppObservableStore.getGlobalVariableState('editPersonDrawerTeamId');
    // console.log('EditPersonDrawerMainContent-onTeamStoreChange teamIdTemp: ', teamIdTemp);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    const personIdTemp = AppObservableStore.getGlobalVariableState('editPersonDrawerPersonId');
    if (apiCalming(`personRetrieve-${personIdTemp}`, 30000)) {
      PersonActions.personRetrieve(personIdTemp);
    }

    return () => {
      // console.log('EditPersonDrawerMainContent cleanup');
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <EditPersonDrawerMainContentWrapper>
      <EditPersonWrapper>
        <EditPersonForm />
      </EditPersonWrapper>
    </EditPersonDrawerMainContentWrapper>
  );
};
EditPersonDrawerMainContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
});

const EditPersonDrawerMainContentWrapper = styled('div')`
`;

const EditPersonWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(styles)(EditPersonDrawerMainContent);
