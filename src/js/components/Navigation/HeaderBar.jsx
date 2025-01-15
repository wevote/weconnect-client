import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import styled from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
// import { handleResize } from '../../common/utils/isMobileScreenSize';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import { displayTopMenuShadow } from '../../utils/applicationUtils';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../Style/pageLayoutStyles';
import HeaderBarLogo from './HeaderBarLogo';


const HeaderBar = () => {
  renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
  // eslint-disable-next-line no-unused-vars
  const [scrolledDown, setScrolledDown] = React.useState(false);
  const [tabsValue, setTabsValue] = React.useState('1');
  // eslint-disable-next-line no-unused-vars
  const [showTabs, setShowTabs] = React.useState(true);
  const navigate = useNavigate();


  // This does not do anything
  // const handleResizeLocal = () => {
  //   if (handleResize('HeaderBar')) {
  //     // this.setState({});
  //   }
  // };

  const initializeTabValue = () => {
    console.log('initializeTabValue normalizedHrefPage():', normalizedHrefPage());
    switch (normalizedHrefPage()) {
      case 'tasks':
        setTabsValue('1');
        console.log('initializeTabValue  setTabsValue: 1');
        break;
      case 'team-home':
      case 'teams':
        setTabsValue('2');
        console.log('initializeTabValue  setTabsValue: 2');
        break;
      case 'questionnaire':
      case 'system-settings':
      case 'task-group':
        setTabsValue('3');
        console.log('initializeTabValue  setTabsValue: 3');
        break;
      default:
        setTabsValue('1');
        console.log('initializeTabValue  setTabsValue default: 1');
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    console.log(`handleTabChange newValue: ${newValue}`);
    // setTabsValue(newValue);
    switch (newValue) {
      case '1':
        // window.history.pushState({}, '', '/tasks'); Only changes the url, does not change the page render
        navigate('/tasks');
        break;
      case '2':
        navigate('/teams');
        break;
      case '3':
        navigate('/system-settings');
        break;
      default:
        navigate('/tasks');
        break;
    }
    initializeTabValue();
  };

  useEffect(() => {
    initializeTabValue();
  }, []);

  // This does not look like it does anything, except always return true
  // const showTabs = () => {
  //   // console.log('showTabs normalizedHrefPage():', normalizedHrefPage());
  //   switch (normalizedHrefPage()) {
  //     case 'q':
  //       return false;
  //     default:
  //       break;
  //   }
  //   return true;
  // };

  // const onAppObservableStoreChange = () => {
  //   // console.log('------ HeaderBar, onAppObservableStoreChange received: ', msg);
  //   setScrolledDown(false);
  // };
  console.log('tabs value ==== ', tabsValue);
  return (
    <HeaderBarWrapper
      $hasNotch={hasIPhoneNotch()}
      $scrolledDown={scrolledDown}
      $hasSubmenu={displayTopMenuShadow()}
    >
      <TopOfPageHeader>
        <TopRowOneLeftContainer>
          <HeaderBarLogo linkOff={!showTabs} />
        </TopRowOneLeftContainer>
        <TopRowOneMiddleContainer>
          {showTabs && (
            <Tabs value={tabsValue} onChange={handleTabChange} aria-label="Tabs selector">
              <Tab value="1" label="Dashboard" />
              <Tab value="2" label="Teams" />
              <Tab value="3" label="Settings" />
            </Tabs>
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

// const TabsStyled = styled(Tabs)`
// `;

export default withStyles(styles)(HeaderBar);


// {/* <TabsStyled */}
// {/*   value={tabsValue} */}
// {/*   indicatorColor="primary" */}
// {/* > */}
// {/*         <TabWithPushHistory */}
// {/*           id="headerTabDashboard" */}
// {/*           label="Dashboard" */}
// {/*           change={handleTabChange} */}
// {/*           to="/tasks" */}
// {/*           value={0} */}
// {/*         /> */}
// {/*         <TabWithPushHistory */}
// {/*           id="headerTabTeams" */}
// {/*           label="Teams" */}
// {/*           change={handleTabChange} */}
// {/*           to="/teams" */}
// {/*           value={1} */}
// {/*         /> */}
// {/*         <TabWithPushHistory */}
// {/*           id="headerTabSettings" */}
// {/*           label="Settings" */}
// {/*           change={handleTabChange} */}
// {/*           to="/system-settings" */}
// {/*           value={2} */}
// {/*         /> */}
// </TabsStyled>
