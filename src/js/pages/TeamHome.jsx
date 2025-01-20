import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import { renderLog } from '../common/utils/logging';
import AddPersonDrawer from '../components/Drawers/AddPersonDrawer';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import { useConnectAppContext } from '../contexts/ConnectAppContext';
import useFetchData from '../react-query/fetchData';
import { getTeamList } from '../react-query/TeamsQueryProcessing';


const TeamHome = ({ classes }) => {
  renderLog('TeamHome');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();

  const params  = useParams();
  const [team, setTeam] = useState({});
  const [teamId] = useState(params.teamId);
  const displayAddDrawer = getAppContextValue('addPersonDrawerOpen');

  const updateTeam = (tList) => {
    const oneTeam = tList.find((staff) => staff.teamId === parseInt(teamId));
    setTeam(oneTeam);
  };

  const isAddPersonDrawerOpen = document.getElementById('addPersonDrawer');
  const { data, isSuccess, isFetching } = useFetchData(['team-list-retrieve'], {});
  useEffect(() => {
    console.log('useFetchData in TeamHome (team-list-retrieve) useEffect:', data, isSuccess, isFetching);
    if (isSuccess) {
      console.log('useFetchData in TeamHome useEffect data good:', data, isSuccess, isFetching);
      const tList = getTeamList(data);
      setAppContextValue('teamListNested', tList);
      updateTeam(tList);
    }
  }, [isAddPersonDrawerOpen, data]);

  const { data: dataP, isSuccess: isSuccessP, isFetching: isFetchingP, isStale: isStaleP } = useFetchData(['person-list-retrieve'], {});
  useEffect(() => {
    console.log('useFetchData in TeamHome (person-list-retrieve) useEffect:', dataP, isSuccessP, isFetchingP, isStaleP);
    if (isSuccessP) {
      // console.log('useFetchData in TeamHome (person-list-retrieve)useEffect data good:', dataP, isSuccessP, isFetchingP, isStaleP);
      setAppContextValue('allStaffList', dataP ? dataP.personList : []);
      // console.log('allStaffList --- dataP.personList:', dataP ? dataP.personList : []);
    }
  }, [dataP, isSuccessP, isFetchingP]);

  const addTeamMemberClick = () => {
    // console.log('TeamHome addTeamMemberClick, teamId:', teamId);
    setAppContextValue('addPersonDrawerOpen', true);
    setAppContextValue('addPersonDrawerTeam', team);
    setAppContextValue('teamId', team.id);
  };

  return (
    <div>
      <Helmet>
        <title>
          Team Home -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* TODO 1/12/25: The following line might be reloading the app, consider using navigate() */}
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} />
      </Helmet>
      <PageContentContainer>
        <h1>{team ? team.teamName : 'none'}</h1>
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
        <TeamHeader team={team} showHeaderLabels={(team && team.teamMemberList && team.teamMemberList.length > 0)} showIcons={false} />
        <TeamMemberList teamId={teamId} />
        {displayAddDrawer ? <AddPersonDrawer /> : null }
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
