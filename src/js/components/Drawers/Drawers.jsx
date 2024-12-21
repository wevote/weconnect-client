import React, { Suspense } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AddPersonDrawer from './AddPersonDrawer';
import AddTeamDrawer from './AddTeamDrawer';
import EditPersonDrawer from './EditPersonDrawer';
import { messageService } from '../../stores/AppObservableStore';
import { renderLog } from '../../common/utils/logging';


const Drawers = () => {  //  classes, teamId
  renderLog('Drawers');  // Set LOG_RENDER_EVENTS to log all renders

  const onAppObservableStoreChange = () => {
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
    };
  }, []);

  return (
    <Suspense fallback={<></>}>
      <AddPersonDrawer />
      <AddTeamDrawer />
      <EditPersonDrawer />
    </Suspense>
  );
};
Drawers.propTypes = {
  match: PropTypes.object,
};

const styles = () => ({
});

const SearchBarWrapper = styled('div')`
  // margin-top: 14px;
  // margin-bottom: 8px;
  width: 100%;
`;

export default withStyles(styles)(Drawers);
