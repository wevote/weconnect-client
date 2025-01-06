import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonActions from '../../actions/PersonActions';
import PersonStore from '../../stores/PersonStore';
import TeamStore from '../../stores/TeamStore';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import PersonProfile from './PersonProfile';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';


// eslint-disable-next-line no-unused-vars
const PersonProfileDrawerMainContent = ({ classes }) => {  //  classes, teamId
  renderLog('PersonProfileDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders
  // eslint-disable-next-line no-unused-vars
  const [personId, setPersonId] = React.useState(-1);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes

  // const onAppObservableStoreChange = () => {
  //   // const teamIdTemp = AppObservableStore.getGlobalVariableState('personProfileDrawerTeamId');
  //   // console.log('PersonProfileDrawerMainContent AppObservableStore-personProfileDrawerTeamId: ', teamIdTemp);
  // };

  const onPersonStoreChange = () => {
    const personIdTemp = getAppContextValue('personProfileDrawerPersonId');
    // console.log('PersonProfileDrawerMainContent personSearchResultsList:', personSearchResultsListTemp);
    setPersonId(personIdTemp);
    // console.log('PersonProfileDrawerMainContent-onPersonStoreChange personIdTemp: ', personIdTemp);
  };

  const onTeamStoreChange = () => {
    // const teamIdTemp = getAppContextValue('personProfileDrawerTeamId');
    // console.log('PersonProfileDrawerMainContent-onTeamStoreChange teamIdTemp: ', teamIdTemp);
  };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    const personIdTemp = getAppContextValue('personProfileDrawerPersonId');
    if (apiCalming(`personRetrieve-${personIdTemp}`, 30000)) {
      PersonActions.personRetrieve(personIdTemp);
    }

    return () => {
      // console.log('PersonProfileDrawerMainContent cleanup');
      // appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  const personIdTemp = getAppContextValue('personProfileDrawerPersonId');

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile personId={personIdTemp} />
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
