import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { useConnectAppContext } from '../contexts/ConnectAppContext';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import { renderLog } from '../common/utils/logging';
import AddPersonDrawer from '../components/Drawers/AddPersonDrawer';
import useFetchData from '../react-query/fetchData';
import { getTeamList } from '../react-query/TeamsQueryProcessing';


const TeamHome = ({ classes }) => {  //  classes, params
  renderLog('TeamHome');  // Set LOG_RENDER_EVENTS to log all renders
  const params  = useParams();
  const [team, setTeam] = React.useState({});
  const [teamFound, setTeamFound] = React.useState(false);
  const [teamId] = React.useState(params.teamId);
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes
  const displayDrawer = getAppContextValue('addPersonDrawerOpen');

  const updateTeam = (tList) => {
    const oneTeam = tList.find((staff) => staff.teamId === parseInt(teamId));
    setTeam(oneTeam);
  };

  const teamList = getAppContextValue('teamListNested');
  if (teamList && !teamFound) {   // If you navigate directly to team-home, in a new session 'teamListNested' will not be set.  Fixable but low priority.
    setTeamFound(true);
    updateTeam(teamList);
  }

  const isDrawerOpen = document.getElementById("addPersonDrawer");
  const { data, isSuccess } = useFetchData('team-list-retrieve', {});
  useEffect(() => {
    console.log('teamListNested update with newly fetched data in TeamHome, isSuccess: ', isSuccess);
    if (isSuccess) {
      const tList = getTeamList(data);
      setAppContextValue('teamListNested', tList);
      updateTeam(tList);
    }
  }, [isDrawerOpen]);


  const addTeamMemberClick = () => {
    // console.log('TeamHome addTeamMemberClick, teamId:', teamId);
    setAppContextValue('addPersonDrawerOpen', true);
    setAppContextValue('addPersonDrawerTeam', team);
  };

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
        <div>
          Team Home for
          {' '}
          {team ? team.teamName : 'none'}
          {' '}
          -
          {' '}
          <Link to="/teams">team list</Link>
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
        {displayDrawer ? <AddPersonDrawer /> : null }
      </PageContentContainer>
    </div>
  );
};
TeamHome.propTypes = {
  classes: PropTypes.object.isRequired,
  // params: PropTypes.object.isRequired,
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

// const TeamMember = styled('div')`
// `;

export default withStyles(styles)(TeamHome);
