import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import PersonStore from '../stores/PersonStore';
import TeamActions from '../actions/TeamActions';
import TeamStore from '../stores/TeamStore';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import apiCalming from '../common/utils/apiCalming';
import convertToInteger from '../common/utils/convertToInteger';
import { renderLog } from '../common/utils/logging';


const TeamHome = ({ classes, match }) => {  //  classes, teamId
  renderLog('TeamHome');  // Set LOG_RENDER_EVENTS to log all renders
  const [team, setTeam] = React.useState({});
  const [teamId, setTeamId] = React.useState(-1);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamChange = (teamIdIncoming) => {
    // console.log('TeamHome onRetrieveTeamChange, teamIdIncoming:', teamIdIncoming);
    const teamTemp = TeamStore.getTeamById(teamIdIncoming);
    setTeam(teamTemp);
  };

  const onPersonStoreChange = () => {
    const { params } = match;
    const teamIdTemp = convertToInteger(params.teamId);
    if (teamIdTemp >= 0) {
      setTeamId(teamIdTemp);
    }
    onRetrieveTeamChange(teamIdTemp);
    if (apiCalming(`teamRetrieve-${teamIdTemp}`, 1000)) {
      TeamActions.teamRetrieve(teamIdTemp);
    }
  };

  const onTeamStoreChange = () => {
    const { params } = match;
    const teamIdTemp = convertToInteger(params.teamId);
    if (teamIdTemp >= 0) {
      setTeamId(teamIdTemp);
    }
    onRetrieveTeamChange(teamIdTemp);
  };

  const addTeamMemberClick = () => {
    // console.log('TeamHome addTeamMemberClick, teamId:', teamId);
    AppObservableStore.setGlobalVariableState('addPersonDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('addPersonDrawerTeamId', teamId);
  };

  React.useEffect(() => {
    const { params } = match;
    const teamIdTemp = convertToInteger(params.teamId);

    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    if (teamIdTemp >= 0) {
      if (apiCalming(`teamRetrieve-${teamIdTemp}`, 1000)) {
        TeamActions.teamRetrieve(teamIdTemp);
      }
    }

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          Team Home -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} />
      </Helmet>
      <PageContentContainer>
        <h1>{team.teamName}</h1>
        <div>
          <Link to="/teams">back to team list</Link>
        </div>
        <Button
          classes={{ root: classes.addTeamMemberButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamMemberClick}
        >
          Add Team Member
        </Button>
        <TeamHeader showHeaderLabels={(team.teamMemberList && team.teamMemberList.length > 0)} />
        <TeamMemberList teamId={teamId} />
      </PageContentContainer>
    </div>
  );
};
TeamHome.propTypes = {
  classes: PropTypes.object.isRequired,
  // teamId: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamMemberButtonRoot: {
    width: 180,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const TeamMember = styled('div')`
`;

export default withStyles(styles)(TeamHome);
