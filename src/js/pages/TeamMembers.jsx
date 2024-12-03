import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import TeamActions from '../actions/TeamActions';
import TeamStore from '../stores/TeamStore';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';


const TeamMembers = ({ match }) => {  //  classes, teamId
  const [teamId, setTeamId] = React.useState(-1);
  const [teamMemberList, setTeamMemberList] = React.useState([]);
  const [teamMemberCount, setTeamMemberCount] = React.useState(0);

  const onAppObservableStoreChange = () => {
  };

  const onTeamStoreChange = () => {
    const teamMemberListTemp = TeamStore.getTeamMemberList(teamId);
    setTeamMemberList(teamMemberListTemp);
    setTeamMemberCount(teamMemberListTemp.length);
  };

  React.useEffect(() => {
    const { params: {
      teamId: teamIdIncoming,
    } } = match;
    setTeamId(teamIdIncoming);

    console.log('Fetching team members for:', teamIdIncoming);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    TeamActions.teamRetrieve(teamIdIncoming);

    return () => {
      appStateSubscription.unsubscribe();
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
          {webAppConfig.WECONNECT_NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-members`} />
      </Helmet>
      <PageContentContainer>
        Team Members (
        {teamMemberCount}
        )
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

const styles = () => ({
  buttonDesktop: {
    padding: '2px 16px',
    borderRadius: 5,
  },
  searchButton: {
    borderRadius: 50,
  },
});

const SearchBarWrapper = styled('div')`
  // margin-top: 14px;
  // margin-bottom: 8px;
  width: 100%;
`;

export default withStyles(styles)(TeamMembers);
