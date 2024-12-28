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
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import apiCalming from '../common/utils/apiCalming';
import { renderLog } from '../common/utils/logging';


const Teams = ({ classes, match }) => {  //  classes, teamId
  renderLog('Teams');  // Set LOG_RENDER_EVENTS to log all renders
  const [showAllTeamMembers, setShowAllTeamMembers] = React.useState(false);
  const [teamList, setTeamList] = React.useState([]);
  const [teamCount, setTeamCount] = React.useState(0);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamListChange = () => {
    const { params } = match;
    setShowAllTeamMembers(true);
    const teamListTemp = TeamStore.getTeamList(params.teamId);
    // console.log('Teams onRetrieveTeamListChange, params.teamId:', params.teamId, ', TeamStore.getTeamList:', teamListTemp);
    setTeamList(teamListTemp);
    setTeamCount(teamListTemp.length);
  };

  const onPersonStoreChange = () => {
    onRetrieveTeamListChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamListChange();
    if (apiCalming('teamListRetrieve', 1000)) {
      TeamActions.teamListRetrieve();
    }
  };

  const addTeamClick = () => {
    AppObservableStore.setGlobalVariableState('addTeamDrawerOpen', true);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    if (apiCalming('teamListRetrieve', 1000)) {
      TeamActions.teamListRetrieve();
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
          Teams -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} />
      </Helmet>
      <PageContentContainer>
        <div>
          Teams (
          {teamCount}
          ) -
          {' '}
          {showAllTeamMembers ? (
            <SpanWithLinkStyle onClick={() => setShowAllTeamMembers(false)}>hide people</SpanWithLinkStyle>
          ) : (
            <SpanWithLinkStyle onClick={() => setShowAllTeamMembers(true)}>show people</SpanWithLinkStyle>
          )}
          {' '}
          -
          {' '}
          <Link to="/system-settings">settings</Link>
        </div>
        <Button
          classes={{ root: classes.addTeamButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamClick}
        >
          Add Team
        </Button>
        {teamList.map((team, index) => (
          <OneTeamWrapper key={`team-${team.id}`}>
            <TeamHeader team={team} showHeaderLabels={(index === 0) && showAllTeamMembers && (team.teamMemberList && team.teamMemberList.length > 0)} />
            {showAllTeamMembers && (
              <TeamMemberList teamId={team.id} />
            )}
          </OneTeamWrapper>
        ))}
        <div style={{ padding: '100px 0 25px 0', fontWeight: '700' }}>
          <Link to="/login">
            Sign in
          </Link>
        </div>
        <div style={{ padding: '10px 0 25px 0', fontWeight: '700' }}>
          <Link to="/test-auth">
            Example protected page
          </Link>
        </div>

      </PageContentContainer>
    </div>
  );
};
Teams.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamButtonRoot: {
    width: 120,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const OneTeamWrapper = styled('div')`
`;

export default withStyles(styles)(Teams);
