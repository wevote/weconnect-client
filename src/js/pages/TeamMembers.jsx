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
import webAppConfig from '../config';
import apiCalming from '../common/utils/apiCalming';
import arrayContains from '../common/utils/arrayContains';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';
import { renderLog } from '../common/utils/logging';


const TeamMembers = ({ classes, match }) => {  //  classes, teamId
  renderLog('TeamMembers');  // Set LOG_RENDER_EVENTS to log all renders
  const [team, setTeam] = React.useState({});
  const [teamId, setTeamId] = React.useState(-1);
  const [teamMemberCount, setTeamMemberCount] = React.useState(0);
  const [teamMemberList, setTeamMemberList] = React.useState([]);
  const [teamMemberPersonIdList, setTeamMemberPersonIdList] = React.useState([]);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamChange = () => {
    const { params } = match;
    setTeamId(params.teamId);
    const teamTemp = TeamStore.getTeamById(params.teamId);
    setTeam(teamTemp);
    const teamMemberListTemp = TeamStore.getTeamMemberList(params.teamId);
    // console.log('TeamMembers onRetrieveTeamChange, params.teamId:', params.teamId, ', TeamStore.getTeamMemberList:', teamMemberListTemp);
    setTeamMemberCount(teamMemberListTemp.length);
    setTeamMemberList(teamMemberListTemp);
    setTeamMemberPersonIdList(TeamStore.getTeamMemberPersonIdList(params.teamId));
  };

  const onPersonStoreChange = () => {
    const { params } = match;
    onRetrieveTeamChange();
    if (apiCalming(`teamRetrieve-${params.teamId}`, 1000)) {
      TeamActions.teamRetrieve(params.teamId);
    }
  };

  const onTeamStoreChange = () => {
    onRetrieveTeamChange();
  };

  const addTeamMemberClick = () => {
    const { params } = match;
    AppObservableStore.setGlobalVariableState('addPersonDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('addPersonDrawerTeamId', params.teamId);
  };

  React.useEffect(() => {
    const { params } = match;

    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    if (apiCalming(`teamRetrieve-${params.teamId}`, 1000)) {
      TeamActions.teamRetrieve(params.teamId);
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
          Team Members -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-members`} />
      </Helmet>
      <PageContentContainer>
        <div>
          Team Members for
          {' '}
          {team.teamName}
          {' '}
          (
          {teamMemberCount}
          ) -
          {' '}
          <Link to="/teams">home</Link>
        </div>
        <Button
          classes={{ root: classes.addTeamMemberButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamMemberClick}
        >
          Add Team Member
        </Button>
        {teamMemberList.map((teamMember) => (
          <TeamMember key={`personId-${teamMember.personId}`}>
            {teamMember.firstName}
            {' '}
            {teamMember.lastName}
            {arrayContains(teamMember.personId, teamMemberPersonIdList) && (
              <>
                {' '}
                <SpanWithLinkStyle onClick={() => TeamActions.removePersonFromTeam(teamMember.personId, teamId)}>remove</SpanWithLinkStyle>
              </>
            )}
          </TeamMember>
        ))}
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
    width: 180,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const SpanWithLinkStyle = styled('span')`
  text-decoration: underline;
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
`;

const TeamMember = styled('div')`
`;

export default withStyles(styles)(TeamMembers);
