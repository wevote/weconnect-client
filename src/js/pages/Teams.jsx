import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { useQuery } from '@tanstack/react-query';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import { renderLog } from '../common/utils/logging';
import { useConnectAppContext } from '../contexts/ConnectAppContext';
import { getTeamList } from '../react-query/TeamsQueryProcessing';
import weConnectQueryFn from '../react-query/WeConnectQuery';
import AddTeamDrawer from '../components/Drawers/AddTeamDrawer';


const Teams = ({ classes, match }) => {  //  classes, teamId
  renderLog('Teams');  // Set LOG_RENDER_EVENTS to log all renders
  const [showAllTeamMembers, setShowAllTeamMembers] = React.useState(false);
  const [teamList, setTeamList] = React.useState([]);
  const [teamCount, setTeamCount] = React.useState(-1);
  const { setAppContextValue, getAppContextValue, getAppContextData } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes
  console.log('match: ', match);
  let displayDrawer = getAppContextValue('addTeamDrawerOpen');

  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['team-list-retrieve'],
    queryFn: ({ queryKey }) => weConnectQueryFn(queryKey[0], {}),
  });

  if (isLoading) {
    console.log('Fetching teams...');
  } else if (error) {
    console.log(`An error occurred: ${error.message}`);
  } else if (isSuccess && teamCount < 0) {
    console.log('Successfully retrieved teams...');
    const teamListTemp = getTeamList(data);
    setShowAllTeamMembers(true);
    console.log('Teams onRetrieveTeamListChange, params.teamId:  HACKED nope', ', TeamStore.getTeamList:', teamListTemp);
    setTeamList(teamListTemp);
    setTeamCount(teamListTemp.length);
    setAppContextValue('teamListNested', teamListTemp);
  }

  const addTeamClick = () => {
    setAppContextValue('addTeamDrawerOpen', true);
    displayDrawer = true;
    // setDisplayDrawer(true);
  };

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('Teams: Context value changed:', true);
  }, [getAppContextData()]);

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
          // onClick={addTeamClick}
          onClick={() => addTeamClick()}
        >
          Add Team
        </Button>
        {teamList.map((team, index) => (
          <OneTeamWrapper key={`team-${team.id}`}>
            <TeamHeader team={team} showHeaderLabels={(index === 0) && showAllTeamMembers && (team.teamMemberList && team.teamMemberList.length > 0)} />
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
        {displayDrawer ? <AddTeamDrawer /> : null }
        {/* <ReactQueryDevtools initialIsOpen /> */}
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
