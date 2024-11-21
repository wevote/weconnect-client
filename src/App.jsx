import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import OpenReplay from '@openreplay/tracker';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import VoterActions from './js/actions/VoterActions';
import VoterSessionActions from './js/actions/VoterSessionActions';
import muiTheme from './js/common/components/Style/muiTheme';
import LoadingWheelComp from './js/common/components/Widgets/LoadingWheelComp';
import AppObservableStore, { messageService } from './js/common/stores/AppObservableStore';
import { getAndroidSize, getIOSSizeString, hasDynamicIsland, isIOS } from './js/common/utils/cordovaUtils';
import historyPush from './js/common/utils/historyPush';
import { isWeVoteMarketingSite, normalizedHref } from './js/common/utils/hrefUtils';
import initializejQuery from './js/common/utils/initializejQuery';
import { isAndroid, isCordova, isWebApp } from './js/common/utils/isCordovaOrWebApp';
import { renderLog } from './js/common/utils/logging';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import webAppConfig from './js/config';
import VoterStore from './js/stores/VoterStore';
// importRemoveCordovaListenersToken1  -- Do not remove this line!

// Root URL pages

const FAQ = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './js/pages/More/FAQ'));
const Footer = React.lazy(() => import(/* webpackChunkName: 'Footer' */ './js/components/Navigation/Footer'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ './js/pages/PageNotFound'));

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unused-state */

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hideHeader: false,
      hideFooter: false,
      showReadyLight: true,
      enableFullStory: false,
    };
    this.setShowHeader = this.setShowHeader.bind(this);
    this.setShowFooter = this.setShowFooter.bind(this);
    this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);  // Look more closely at this
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.bypass2FA = this.bypass2FA.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have an "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    let { hostname } = window.location;
    hostname = hostname || '';
    initializejQuery(() => {
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    // console.log('href in App.js componentDidMount: ', window.location.href);
    // console.log('normalizedHrefPage in App.js componentDidMount: ', normalizedHref());
    const onWeVoteUS = (hostname && (hostname.toLowerCase() === 'wevote.us'));
    const onMobileApp = false;
    if (isAndroid()) {         // December 12, 2023: All sorts of problems with sign-in with Facebook on Android, so disabling it here
      webAppConfig.ENABLE_FACEBOOK = false;   // This overrides the config setting for the entire Android app
    }

    if (isCordova()) {
      const size = isIOS() ?  getIOSSizeString() : getAndroidSize();
      console.log('Cordova:   device model', window.device.model, '  size: ', size);
      console.log('Cordova:   Header, hasDynamicIsland', hasDynamicIsland());
    }

    this.bypass2FA();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.bypass2FA();
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Amazon Cloud Watch
    console.error('App caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
    // removeCordovaListenersToken -- Do not remove this line!
  }

  onAppObservableStoreChange () {
    if (!AppObservableStore.getGoogleAnalyticsEnabled() && !AppObservableStore.getGoogleAnalyticsPending()) {
      AppObservableStore.setGoogleAnalyticsPending(true);
      setTimeout(() => {
        const chosenTrackingId = AppObservableStore.getChosenGoogleAnalyticsTrackingID();
        const weVoteTrackingId = webAppConfig.GOOGLE_ANALYTICS_TRACKING_ID || '';

        if (chosenTrackingId && weVoteTrackingId) {
          console.log('Google Analytics (2) ENABLED');
          ReactGA.initialize([
            {
              trackingId: chosenTrackingId,
            },
            {
              trackingId: weVoteTrackingId,
            },
          ]);
        } else if (chosenTrackingId) {
          console.log('Google Analytics Chosen ENABLED');
          ReactGA.initialize(chosenTrackingId);
          AppObservableStore.setGoogleAnalyticsEnabled(true);
          AppObservableStore.setGoogleAnalyticsPending(false);
        } else if (weVoteTrackingId) {
          console.log('Google Analytics ENABLED');
          ReactGA.initialize(weVoteTrackingId);
          AppObservableStore.setGoogleAnalyticsEnabled(true);
          AppObservableStore.setGoogleAnalyticsPending(false);
        } else {
          console.log('Google Analytics did not receive a trackingID, NOT ENABLED');
        }

        const voterWeVoteId = VoterStore.getVoterWeVoteId();
        const weVoteGTMId = webAppConfig.GOOGLE_TAG_MANAGER_ID || '';

        if (weVoteGTMId) {
          const tagManagerArgs = {
            gtmId: weVoteGTMId,
            dataLayer: {
              weVoteId: voterWeVoteId,
            },
          };

          console.log('Initializing Google Tag Manager with GTM ID:', weVoteGTMId);
          TagManager.initialize(tagManagerArgs);
        } else {
          console.log('Google Tag Manager did not receive a valid GTM ID, NOT ENABLED');
        }
      }, 3000);
    }
    if (!AppObservableStore.getOpenReplayEnabled() && !AppObservableStore.getOpenReplayPending()) {
      AppObservableStore.setOpenReplayPending(true);
      setTimeout(() => {
        // const chosenProjectKey = AppObservableStore.getChosenOpenReplayTrackingID();
        const weVoteOpenReplayProjectKey = webAppConfig.OPEN_REPLAY_PROJECT_KEY;
        const weVoteOpenReplayIngestPoint = webAppConfig.OPEN_REPLAY_INGEST_POINT;
        // const openReplayProjectKey = chosenProjectKey || weVoteOpenReplayProjectKey;
        const openReplayProjectKey = weVoteOpenReplayProjectKey || '';
        const openReplayIngestPoint = weVoteOpenReplayIngestPoint || false;
        let tracker;
        if (openReplayProjectKey) {
          console.log('OpenReplay ENABLED');
          if (openReplayIngestPoint) {
            tracker = new OpenReplay({
              projectKey: openReplayProjectKey,
              ingestPoint: openReplayIngestPoint,
              resourceBaseHref: 'https://wevote.us/',
            });
          } else {
            tracker = new OpenReplay({
              projectKey: openReplayProjectKey,
              resourceBaseHref: 'https://wevote.us/',
            });
          }
          const voterWeVoteId = VoterStore.getVoterWeVoteId();
          tracker.start({
            userID: voterWeVoteId,
          });
          AppObservableStore.setOpenReplayTracker(tracker);
          AppObservableStore.setOpenReplayEnabled(true);
          AppObservableStore.setOpenReplayPending(false);
          if (voterWeVoteId) {
            AppObservableStore.setOpenReplayVoterWeVoteId(voterWeVoteId);
          }
        } else {
          console.log('OpenReplay did not receive a projectKey, NOT ENABLED');
        }
      }, 3000);
    }
  }

  onVoterStoreChange () {
    historyPush(this.props.location.pathname);
  }

  setShowHeader (doShowHeader) {
    this.setState({ hideHeader: !doShowHeader });
  }

  setShowFooter (doShowFooter) {
    this.setState({ hideFooter: !doShowFooter });
  }

  setShowHeaderFooter (doShow) {
    // console.log('setShowHeaderFooter -------------- doShow:', doShow);
    this.setState({
      hideHeader: !doShow,
      hideFooter: !doShow,
    });
  }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  bypass2FA () {
    const queryString = this.props.location.search;
    const query = new URLSearchParams(queryString);
    const cid = query.get('cid');
    const voterDeviceId = VoterStore.voterDeviceId();
    if (cid && cid !== voterDeviceId) {
      VoterSessionActions.setVoterDeviceIdCookie(cid);
      VoterActions.voterRetrieve();
    }
  }

  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { hideHeader, showReadyLight, enableFullStory } = this.state;
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite();
    // const firstVisit = !cookies.getItem('voter_device_id');
    const loadingPageHtml = (
      <div id="loading-screen">
        <div style={{ display: 'flex', position: 'fixed', height: '100vh', width: '100vw', top: 0, left: 0, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: '#2E3C5D', flexDirection: 'column', fontFamily: '\'Source Sans Pro\', sans-serif', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '\'Source Sans Pro\', sans-serif', fontSize: '32px', fontWeight: 'normal', color: '#2E3C5D' }}>Loading your ballot...</h1>
          <div style={{ margin: '0 15px', textAlign: 'center' }}>Thank you for being a voter!</div>
        </div>
      </div>
    );

    if (isWebApp()) {
      // console.log('WebApp: href in App.js render: ', window.location.href);
    } else {
      console.log('Cordova:   href hash in App.js render: ', window.location.hash);
    }

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    if (window.location.href.endsWith('/storybook')) {
      const destinationHref = `${window.location.href}-static/index.html?path=/docs/design-system--docs`;
      console.log('Storybook redirect from: ', window.location.href, ' to: ', destinationHref);
      window.location.href = destinationHref;
    }

    return (
      <>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            {/* March 2022: We used to have two themeproviders here, one for material-ui, and one for styled-components, but the two are combined in V5 MUI */}
            <WeVoteBody>
              {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chunk). */}
              <Suspense fallback={<HeaderBarSuspense />}>
                <Header hideHeader={hideHeader} params={{ }} pathname={normalizedHref()} />
              </Suspense>
              <Suspense fallback={<LoadingWheelComp />}>
                <Switch>
                  <Route path="/faq" exact><FAQ /></Route>

                  <Route path="*" component={PageNotFound} />
                </Switch>
              </Suspense>
              <Suspense fallback={<span>&nbsp;</span>}>
                <Footer />
              </Suspense>
            </WeVoteBody>
          </ThemeProvider>
        </StyledEngineProvider>
      </>
    );
  }
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

App.propTypes = {
  location: PropTypes.object,
};

export default withRouter(App);
