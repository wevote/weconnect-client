import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import styled from 'styled-components';
import { PrivateRoute } from './js/auth';
import muiTheme from './js/common/components/Style/muiTheme';
import { normalizedHref } from './js/common/utils/hrefUtils';
import initializejQuery from './js/common/utils/initializejQuery';
import { renderLog } from './js/common/utils/logging';
import Drawers from './js/components/Drawers/Drawers';
import ConnectAppContext from './js/contexts/ConnectAppContext';
import Login from './js/pages/Login';


// Root URL pages

const AnswerQuestionsForm = React.lazy(() => import(/* webpackChunkName: 'AnswerQuestionsForm' */ './js/pages/AnswerQuestionsForm'));
const FAQ = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './js/pages/FAQ'));
// const Footer = React.lazy(() => import(/* webpackChunkName: 'Footer' */ './js/components/Navigation/Footer'));
const Header = React.lazy(() => import(/* webpackChunkName: 'Header' */ './js/components/Navigation/Header'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ './js/pages/PageNotFound'));
const QuestionnaireAnswers = React.lazy(() => import(/* webpackChunkName: 'QuestionnaireAnswers' */ './js/pages/QuestionnaireAnswers'));
const QuestionnaireQuestionList = React.lazy(() => import(/* webpackChunkName: 'QuestionnaireQuestionList' */ './js/pages/SystemSettings/Questionnaire'));
const SystemSettings = React.lazy(() => import(/* webpackChunkName: 'SystemSettings' */ './js/pages/SystemSettings/SystemSettings'));
const TeamHome = React.lazy(() => import(/* webpackChunkName: 'TeamHome' */ './js/pages/TeamHome'));
const TaskGroup = React.lazy(() => import(/* webpackChunkName: 'TaskGroup' */ './js/pages/SystemSettings/TaskGroup'));
const Tasks = React.lazy(() => import(/* webpackChunkName: 'Tasks' */ './js/pages/Tasks'));
// const TeamMembers = React.lazy(() => import(/* webpackChunkName: 'TeamMembers' */ './js/pages/TeamHome'));
const Teams = React.lazy(() => import(/* webpackChunkName: 'Teams' */ './js/pages/Teams'));


function App () {
  renderLog('App');
  const [hideHeader] = useState(false);


  // Inject this once for the app, for all react-query queries
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  useEffect(() => {
    console.log('--------- initializejQuery() ---------');
    initializejQuery(() => {
      console.log('--------- jQuery has been initialized ---------');
    });
    return () => {
      // Anything in here is fired on component unmount, equiv to componentDidUnmount()
    };
  }, []);


  const isAuth = localStorage.getItem('isAuthenticated');
  console.log('======================================== isAuthenticated: "  ', isAuth, ' =============================');

  return (
    <>
      <StyledEngineProvider injectFirst>
        <QueryClientProvider client={queryClient}>
          <ConnectAppContext>
            <ThemeProvider theme={muiTheme}>
              <BrowserRouter>
                <WeVoteBody>
                  <Header hideHeader={hideHeader} params={{ }} pathname={normalizedHref()} />
                  <Drawers />
                  <Routes>
                    <Route path="/answers/:questionnaireId/:personId" exact component={QuestionnaireAnswers} />
                    <Route element={<PrivateRoute />}>
                      <Route path="/faq" element={<FAQ />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/q/:questionnaireId/:personId" element={<AnswerQuestionsForm />} />
                    <Route path="/questionnaire/:questionnaireId" element={<QuestionnaireQuestionList />} />
                    <Route path="/system-settings" element={<SystemSettings />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/task-group/:taskGroupId" element={<TaskGroup />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/team-home/:teamId" element={<TeamHome />} />
                    <Route path="/" element={<Teams />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                  {/* Hack 1/14/25 <Footer /> */}
                  <ReactQueryDevtools />
                </WeVoteBody>
              </BrowserRouter>
            </ThemeProvider>
          </ConnectAppContext>
        </QueryClientProvider>
      </StyledEngineProvider>
    </>
  );
}

const WeVoteBody = styled('div')`
  // In WebApp, we rely on many of these from the body from main.css, including:
  background-color: #fff; // rgb(235, 236, 238); // #fafafa;
  color: #000;
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;

  display: block;
  position: relative;
  z-index: 0;
  // this debug technique works!  ${() => console.log('-----------------------------')}
`;

// App.propTypes = {
//   location: PropTypes.object,
// };

// export default withRouter(App);
export default App;


// import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
// import PropTypes from 'prop-types';
// import AppObservableStore, { messageService } from './js/stores/AppObservableStore';
// import { getAndroidSize, getIOSSizeString, hasDynamicIsland, isIOS } from './js/common/utils/cordovaUtils';
// import historyPush from './js/common/utils/historyPush';
// import webAppConfig from './js/config';
// import VoterStore from './js/stores/VoterStore';
// import VoterSessionActions from './js/actions/VoterSessionActions';
// import OpenReplay from '@openreplay/tracker';
// import ReactGA from 'react-ga4';
// import TagManager from 'react-gtm-module';

// const [enableFullStory, setEnableFullStory] = useState(false);
// const [showFooter, setShowFooter] = useState(false);

// constructor (props) {
//   super(props);
//   this.state = {
//     hideHeader: false,
//     hideFooter: false,
//     showReadyLight: true,
//     enableFullStory: false,
//     isJqueryInitialized: false,
//   };
//   this.setShowHeader = this.setShowHeader.bind(this);
//   this.setShowFooter = this.setShowFooter.bind(this);
//   this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);  // Look more closely at this
//   this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
//   this.bypass2FA = this.bypass2FA.bind(this);
//   this.localIsCordova();
//   console.log('--------- initializejQuery() -----------------------------');
//   initializejQuery(() => {});
// }
//
// // See https://reactjs.org/docs/error-boundaries.html
// static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
//   // Update state so the next render will show the fallback UI, We should have an "Oh snap" page
//   console.log('App caught error ', error);
//   return { hasError: true };
// }

// const setShowHeader = (doShowHeader) => {
//   setHideHeader(!doShowHeader );
// }

// handled by useState at top
// const setShowFooter (doShowFooter) {
//   this.setState({ hideFooter: !doShowFooter });
// }

// setShowHeaderFooter (doShow) {
//   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
//   this.setState({
//     hideHeader: !doShow,
//     hideFooter: !doShow,
//   });
// }
//
// setShowReadyHeavy () {
//   this.setState({ showReadyLight: false });
// }
//
// bypass2FA () {
//   const queryString = this.props.location.search;
//   const query = new URLSearchParams(queryString);
//   const cid = query.get('cid');
//   const voterDeviceId = VoterStore.voterDeviceId();
//   if (cid && cid !== voterDeviceId) {
//     VoterSessionActions.setVoterDeviceIdCookie(cid);
//     // VoterActions.voterRetrieve();
//   }
// }
//
// localIsCordova () {
//   const { cordova } = window;
//   window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
//   return cordova !== undefined;
// }
// if (isWebApp()) {
//   // console.log('WebApp: href in App.js render: ', window.location.href);
// } else {
//   console.log('Cordova:   href hash in App.js render: ', window.location.hash);
// }


// componentDidUpdate (prevProps) {
//   if (prevProps.location.search !== this.props.location.search) {
//     // this.bypass2FA();
//   }
// }
//
// componentDidCatch (error, info) {
//   // We should get this information to Amazon Cloud Watch
//   console.error('App caught error: ', `${error} with info: `, info);
// }
//

// const onAppObservableStoreChange = () => {
//   if (!AppObservableStore.getGoogleAnalyticsEnabled() && !AppObservableStore.getGoogleAnalyticsPending()) {
//     AppObservableStore.setGoogleAnalyticsPending(true);
//     setTimeout(() => {
//       const chosenTrackingId = AppObservableStore.getChosenGoogleAnalyticsTrackingID();
//       const weVoteTrackingId = webAppConfig.GOOGLE_ANALYTICS_TRACKING_ID || '';
//
//       if (chosenTrackingId && weVoteTrackingId) {
//         console.log('Google Analytics (2) ENABLED');
//         ReactGA.initialize([
//           {
//             trackingId: chosenTrackingId,
//           },
//           {
//             trackingId: weVoteTrackingId,
//           },
//         ]);
//       } else if (chosenTrackingId) {
//         console.log('Google Analytics Chosen ENABLED');
//         ReactGA.initialize(chosenTrackingId);
//         AppObservableStore.setGoogleAnalyticsEnabled(true);
//         AppObservableStore.setGoogleAnalyticsPending(false);
//       } else if (weVoteTrackingId) {
//         console.log('Google Analytics ENABLED');
//         ReactGA.initialize(weVoteTrackingId);
//         AppObservableStore.setGoogleAnalyticsEnabled(true);
//         AppObservableStore.setGoogleAnalyticsPending(false);
//       } else {
//         console.log('Google Analytics did not receive a trackingID, NOT ENABLED');
//       }
//
//       const voterWeVoteId = VoterStore.getVoterWeVoteId();
//       const weVoteGTMId = webAppConfig.GOOGLE_TAG_MANAGER_ID || '';
//
//       if (weVoteGTMId) {
//         const tagManagerArgs = {
//           gtmId: weVoteGTMId,
//           dataLayer: {
//             weVoteId: voterWeVoteId,
//           },
//         };
//
//         console.log('Initializing Google Tag Manager with GTM ID:', weVoteGTMId);
//         TagManager.initialize(tagManagerArgs);
//       } else {
//         console.log('Google Tag Manager did not receive a valid GTM ID, NOT ENABLED');
//       }
//     }, 3000);
//   }
//   if (!AppObservableStore.getOpenReplayEnabled() && !AppObservableStore.getOpenReplayPending()) {
//     AppObservableStore.setOpenReplayPending(true);
//     setTimeout(() => {
//       // const chosenProjectKey = AppObservableStore.getChosenOpenReplayTrackingID();
//       const weVoteOpenReplayProjectKey = webAppConfig.OPEN_REPLAY_PROJECT_KEY;
//       const weVoteOpenReplayIngestPoint = webAppConfig.OPEN_REPLAY_INGEST_POINT;
//       // const openReplayProjectKey = chosenProjectKey || weVoteOpenReplayProjectKey;
//       const openReplayProjectKey = weVoteOpenReplayProjectKey || '';
//       const openReplayIngestPoint = weVoteOpenReplayIngestPoint || false;
//       let tracker;
//       if (openReplayProjectKey) {
//         console.log('OpenReplay ENABLED');
//         if (openReplayIngestPoint) {
//           tracker = new OpenReplay({
//             projectKey: openReplayProjectKey,
//             ingestPoint: openReplayIngestPoint,
//             resourceBaseHref: 'https://wevote.us/',
//           });
//         } else {
//           tracker = new OpenReplay({
//             projectKey: openReplayProjectKey,
//             resourceBaseHref: 'https://wevote.us/',
//           });
//         }
//         const voterWeVoteId = VoterStore.getVoterWeVoteId();
//         tracker.start({
//           userID: voterWeVoteId,
//         });
//         AppObservableStore.setOpenReplayTracker(tracker);
//         AppObservableStore.setOpenReplayEnabled(true);
//         AppObservableStore.setOpenReplayPending(false);
//         if (voterWeVoteId) {
//           AppObservableStore.setOpenReplayVoterWeVoteId(voterWeVoteId);
//         }
//       } else {
//         console.log('OpenReplay did not receive a projectKey, NOT ENABLED');
//       }
//     }, 3000);
//   }
// };
//
// const onVoterStoreChange = () => {
//   const { pathname } = useLocation();
//   console.log('---- diagnose app.jsx pathname: ', pathname); // 'this.props.location.pathname: ', this.props.locationpathname);
//   navigate(pathname);
// };


// if (window.location.href.endsWith('/storybook')) {
//   const destinationHref = `${window.location.href}-static/index.html?path=/docs/design-system--docs`;
//   console.log('Storybook redirect from: ', window.location.href, ' to: ', destinationHref);
//   window.location.href = destinationHref;
// }
