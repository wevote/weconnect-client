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
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import apiCalming from '../common/utils/apiCalming';
import { renderLog } from '../common/utils/logging';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';


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
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-members`} />
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
        </div>
        <Button
          classes={{ root: classes.addTeamButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamClick}
        >
          Add Team
        </Button>
        {teamList.map((team) => (
          <OneTeamWrapper key={`team-${team.id}`}>
            <OneTeamHeader>
              <TeamHeaderCell largeFont titleCell width={275}>
                <Link to={`/team-members/${team.id}`}>
                  {team.teamName}
                </Link>
              </TeamHeaderCell>
              {showAllTeamMembers && (
                <TeamHeaderCell width={190}>
                  Title / Volunteering Love
                </TeamHeaderCell>
              )}
            </OneTeamHeader>
            {showAllTeamMembers && (
              <TeamMemberList teamId={team.id} />
            )}
          </OneTeamWrapper>
        ))}
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

const OneTeamHeader = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const OneTeamWrapper = styled('div')`
`;

const SpanWithLinkStyle = styled('span')`
  text-decoration: underline;
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
`;

const TeamHeaderCell = styled('div', {
  shouldForwardProp: (prop) => !['largeFont', 'titleCell', 'width'].includes(prop),
})(({ largeFont, titleCell, width }) => (`
  align-content: center;
  ${(titleCell) ? '' : 'border-bottom: 1px solid #ccc;'}
  ${(largeFont) ? 'font-size: 1.1em;' : 'font-size: .8em;'};
  ${(titleCell) ? '' : 'font-weight: 550;'}
  height: 22px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

export default withStyles(styles)(Teams);
