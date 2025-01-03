import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import EditPersonForm from './EditPersonForm';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';


// eslint-disable-next-line no-unused-vars
const EditPersonDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('EditPersonDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  // eslint-disable-next-line no-unused-vars
  const [teamId, setTeamId] = React.useState(-1);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of WeAppContext changes

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditPersonDrawerMainContent: Context value changed:', true);
    const teamIdTemp = getAppContextValue('editPersonDrawerTeamId');
    // console.log('EditPersonDrawerMainContent AppObservableStore-editPersonDrawerTeamId: ', teamIdTemp);
    setTeamId(teamIdTemp);
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   const teamIdTemp = getAppContextValue('editPersonDrawerTeamId');
  //   // console.log('EditPersonDrawerMainContent AppObservableStore-editPersonDrawerTeamId: ', teamIdTemp);
  //   setTeamId(teamIdTemp);
  // };

  const onPersonStoreChange = () => {
    // const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
    // const teamIdTemp = getAppContextValue('editPersonDrawerTeamId');
    // console.log('EditPersonDrawerMainContent personSearchResultsList:', personSearchResultsListTemp);
  };

  const onTeamStoreChange = () => {
    // const teamIdTemp = getAppContextValue('editPersonDrawerTeamId');
    // console.log('EditPersonDrawerMainContent-onTeamStoreChange teamIdTemp: ', teamIdTemp);
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    const personIdTemp = getAppContextValue('editPersonDrawerPersonId');
    if (apiCalming(`personRetrieve-${personIdTemp}`, 30000)) {
      PersonActions.personRetrieve(personIdTemp);
    }

    return () => {
      // console.log('EditPersonDrawerMainContent cleanup');
      // appStateSubscription.unsubscribe();
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
