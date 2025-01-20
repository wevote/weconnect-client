import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../common/utils/logging';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import { useConnectAppContext } from '../contexts/ConnectAppContext';
import useFetchData from '../react-query/fetchData';
import { getTeamList } from '../react-query/TeamsQueryProcessing';


// eslint-disable-next-line no-unused-vars
const Teams = ({ classes, match }) => {
  renderLog('Teams');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();

  const [showAllTeamMembers, setShowAllTeamMembers] = useState(false);
  const [teamList, setTeamList] = useState([]);

  const { data, isSuccess, isFetching, isStale } = useFetchData(['team-list-retrieve'], {});
  console.log('useFetchData in Teams:', data, isSuccess, isFetching, isStale);
  if (isFetching) {
    console.log('isFetching  ------------');
  }
  useEffect(() => {
    console.log('useFetchData in Teams useEffect:', data, isSuccess, isFetching, isStale);
    if (data !== undefined && isFetching === false && isStale === false) {
      console.log('useFetchData in Teams useEffect data is good:', data, isSuccess, isFetching, isStale);
      console.log('Successfully retrieved teams...');
      const teamListTemp = getTeamList(data);
      setShowAllTeamMembers(true);
      setTeamList(teamListTemp);
      setAppContextValue('teamListNested', teamListTemp);
    }
  }, [data]);

  const addTeamClick = () => {
    setAppContextValue('addTeamDrawerOpen', true);
    setAppContextValue('AddTeamDrawerLabel', 'Add Team');
  };

  const personProfile = getAppContextValue('personProfileDrawerOpen');
  if (personProfile === undefined) {
    setAppContextValue('personProfileDrawerOpen', false);
    setAppContextValue('addTeamDrawerOpen', false);
  }

  return (
    <div>
      <Helmet>
        <title>
          Teams -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* Hack to get to compile */}
        {/* <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} /> */}
      </Helmet>
      <PageContentContainer>
        <h1>
          Teams
        </h1>
        <div>
          {showAllTeamMembers ? (
            <SpanWithLinkStyle onClick={() => setShowAllTeamMembers(false)}>hide people</SpanWithLinkStyle>
          ) : (
            <SpanWithLinkStyle onClick={() => setShowAllTeamMembers(true)}>show people</SpanWithLinkStyle>
          )}
        </div>
        <Button
          classes={{ root: classes.addTeamButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={() => addTeamClick()}
        >
          Add Team
        </Button>
        {teamList.map((team, index) => (
          <OneTeamWrapper key={`team-${team.id}`}>
            <TeamHeader team={team} showHeaderLabels={(index === 0) && showAllTeamMembers && (team.teamMemberList && team.teamMemberList.length > 0)} showIcons />
            {showAllTeamMembers && (
              <TeamMemberList teamId={team.id} teamList={teamList} />
            )}
          </OneTeamWrapper>
        ))}
        <div style={{ padding: '100px 0 25px 0', fontWeight: '700' }}>
          <Link to="/login">
            Sign in
          </Link>
        </div>
      </PageContentContainer>
    </div>
  );
};
Teams.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
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
