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
import { renderLog } from '../common/utils/logging';


const Teams = ({ classes, match }) => {  //  classes, teamId
  renderLog('Teams');  // Set LOG_RENDER_EVENTS to log all renders
  const [teamList, setTeamList] = React.useState([]);
  const [teamCount, setTeamCount] = React.useState(0);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTeamListChange = () => {
    const { params } = match;
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

  const pigsCanFly = false;
  return (
    <div>
      <Helmet>
        <title>
          Teams -
          {' '}
          {webAppConfig.WECONNECT_NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-members`} />
      </Helmet>
      <PageContentContainer>
        <div>
          Teams (
          {teamCount}
          )
        </div>
        <Button
          classes={{ root: classes.addTeamButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamClick}
        >
          Add
        </Button>
        {teamList.map((team) => (
          <div key={`team-${team.id}`}>
            <Link to={`/team-members/${team.id}`}>
              {team.teamName}
            </Link>
          </div>
        ))}
        {pigsCanFly && (
          <SearchBarWrapper>Teams will fly here</SearchBarWrapper>
        )}
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

export default withStyles(styles)(Teams);
