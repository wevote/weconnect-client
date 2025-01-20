import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditPersonForm from './EditPersonForm';


// eslint-disable-next-line no-unused-vars
const EditPersonDrawerMainContent = ({ classes }) => {
  renderLog('EditPersonDrawerMainContent');
  const { getAppContextValue } = useConnectAppContext();

  // eslint-disable-next-line no-unused-vars
  const [teamId, setTeamId] = useState(-1);

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditPersonDrawerMainContent: Context value changed:', true);
    const teamIdTemp = getAppContextValue('editPersonDrawerTeamId');
    setTeamId(teamIdTemp);
  }, [getAppContextValue]);

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
