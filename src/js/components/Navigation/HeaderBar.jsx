import { Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import { messageService } from '../../stores/AppObservableStore';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { handleResize } from '../../common/utils/isMobileScreenSize';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import { displayTopMenuShadow } from '../../utils/applicationUtils';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../Style/pageLayoutStyles';
import HeaderBarLogo from './HeaderBarLogo';
import TabWithPushHistory from './TabWithPushHistory';


const HeaderBar = () => {
  renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
  const [scrolledDown, setScrolledDown] = React.useState(false);
  const [tabsValue, setTabsValue] = React.useState(0);

  const handleResizeLocal = () => {
    if (handleResize('HeaderBar')) {
      // this.setState({});
    }
  };

  const handleTabChange = (newValue) => {
    // console.log(`handleTabChange newValue: ${newValue}`);
    setTabsValue(newValue);
  };

  const initializeTabValue = () => {
    // console.log('initializeTabValue normalizedHrefPage():', normalizedHrefPage());
    switch (normalizedHrefPage()) {
      case 'tasks':
        setTabsValue(0);
        break;
      case 'team-home':
      case 'teams':
        setTabsValue(1);
        break;
      case 'questionnaire':
      case 'system-settings':
      case 'task-group':
        setTabsValue(2);
        break;
      default:
        setTabsValue(0);
        break;
    }
  };

  const showTabs = () => {
    // console.log('showTabs normalizedHrefPage():', normalizedHrefPage());
    switch (normalizedHrefPage()) {
      case 'q':
        return false;
      default:
        break;
    }
    return true;
  };

  const onAppObservableStoreChange = () => {
    // console.log('------ HeaderBar, onAppObservableStoreChange received: ', msg);
    setScrolledDown(false);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    window.addEventListener('resize', handleResizeLocal);

    initializeTabValue();

    return () => {
      appStateSubscription.unsubscribe();
      window.removeEventListener('resize', handleResizeLocal);
    };
  }, []);

  return (
    <HeaderBarWrapper
      hasNotch={hasIPhoneNotch()}
      scrolledDown={scrolledDown}
      hasSubmenu={displayTopMenuShadow()}
    >
      <TopOfPageHeader>
        <TopRowOneLeftContainer>
          <HeaderBarLogo linkOff={!showTabs()} />
        </TopRowOneLeftContainer>
        <TopRowOneMiddleContainer>
          {showTabs() && (
            <TabsStyled
              value={tabsValue}
              indicatorColor="primary"
            >
              <TabWithPushHistory
                id="headerTabDashboard"
                label="Dashboard"
                change={handleTabChange}
                to="/tasks"
                value={0}
              />
              <TabWithPushHistory
                id="headerTabTeams"
                label="Teams"
                change={handleTabChange}
                to="/teams"
                value={1}
              />
              <TabWithPushHistory
                id="headerTabSettings"
                label="Settings"
                change={handleTabChange}
                to="/system-settings"
                value={2}
              />
            </TabsStyled>
          )}
        </TopRowOneMiddleContainer>
        <TopRowOneRightContainer className="u-cursor--pointer">
          &nbsp;
        </TopRowOneRightContainer>
        <TopRowTwoLeftContainer>
          &nbsp;
        </TopRowTwoLeftContainer>
      </TopOfPageHeader>
    </HeaderBarWrapper>
  );
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

const HeaderBarWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hasNotch', 'scrolledDown', 'hasSubmenu'].includes(prop),
})(({ hasNotch, scrolledDown, hasSubmenu }) => (`
  margin-top: ${hasNotch ? '9%' : ''};
  box-shadow: ${(!scrolledDown || !hasSubmenu)  ? '' : standardBoxShadow('wide')};
  border-bottom: ${(!scrolledDown || !hasSubmenu) ? '' : '1px solid #aaa'};
`));

const TabsStyled = styled(Tabs)`
`;

export default withStyles(styles)(HeaderBar);
