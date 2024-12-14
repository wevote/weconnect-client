import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import PersonStore from '../stores/PersonStore';
import TeamActions from '../actions/TeamActions';
import TeamStore from '../stores/TeamStore';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';
import { renderLog } from '../common/utils/logging';


const TeamMembers = ({ classes, match }) => {  //  classes, teamId
  renderLog('TeamMembers');  // Set LOG_RENDER_EVENTS to log all renders
  const [teamId, setTeamId] = React.useState(-1);
  const [teamMemberList, setTeamMemberList] = React.useState([]);
  const [teamMemberCount, setTeamMemberCount] = React.useState(0);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamChange = () => {
    const { params } = match;
    setTeamId(params.teamId);
    const teamMemberListTemp = TeamStore.getTeamMemberList(params.teamId);
    // console.log('TeamMembers onRetrieveTeamChange, params.teamId:', params.teamId, ', TeamStore.getTeamMemberList:', teamMemberListTemp);
    setTeamMemberList(teamMemberListTemp);
    setTeamMemberCount(teamMemberListTemp.length);
  };

  const onPersonStoreChange = () => {
    onRetrieveTeamChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamChange();
  };

  const addTeamMemberClick = () => {
    AppObservableStore.setGlobalVariableState('addPersonDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('addPersonDrawerTeamId', true);
  };

  React.useEffect(() => {
    const { params } = match;

    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    TeamActions.teamRetrieve(params.teamId);

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  const pigsCanFly = false;
  return (
    <div>
      <Helmet>
        <title>
          Team Members -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-members`} />
      </Helmet>
      <PageContentContainer>
        <div>
          Team Members (
          {teamMemberCount}
          )
        </div>
        <Button
          classes={{ root: classes.addTeamMemberButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamMemberClick}
        >
          Add
        </Button>
        {teamMemberList.map((teamMember) => (
          <div key={teamMember.id}>
            {teamMember.firstName}
          </div>
        ))}
        {pigsCanFly && (
          <SearchBarWrapper>Team Members will fly here</SearchBarWrapper>
        )}
      </PageContentContainer>
    </div>
  );
};
TeamMembers.propTypes = {
  classes: PropTypes.object.isRequired,
  // teamId: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamMemberButtonRoot: {
    width: 100,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const SearchBarWrapper = styled('div')`
  // margin-top: 14px;
  // margin-bottom: 8px;
  width: 100%;
`;

export default withStyles(styles)(TeamMembers);
