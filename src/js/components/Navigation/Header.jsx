import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
// import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import apiCalming from '../../common/utils/apiCalming';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { handleResize } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
// import stringContains from '../../common/utils/stringContains';
import VoterStore from '../../stores/VoterStore';
// import { dumpCssFromId } from '../../utils/appleSiliconUtils';
// import { getApplicationViewBooleans, weVoteBrandingOff } from '../../utils/applicationUtils';
import cordovaTopHeaderTopMargin from '../../utils/cordovaTopHeaderTopMargin';
import { HeadroomWrapper } from '../Style/pageLayoutStyles';
import IPhoneSpacer from '../Widgets/IPhoneSpacer';

// TODO: Convert to a functional component, so it can use getContext()
export default class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    // console.log('-----------HEADER constructor');
    this.handleResizeLocal = this.handleResizeLocal.bind(this);
    // this.storeSub = null;
  }

  componentDidMount () {
    // console.log('-----------HEADER componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    window.addEventListener('resize', this.handleResizeLocal);
    // if (isIOSAppOnMac() && appleSiliconDebug) {
    //   dumpCssFromId('header-container');
    // }
    if (VoterStore.getVoterWeVoteId() === '' && apiCalming('voterRetrieve', 500)) {
      // VoterActions.voterRetrieve();
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('!!!Header caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('-----------HEADER componentWillUnmount');
    this.appStateSubscription.unsubscribe();
    window.removeEventListener('resize', this.handleResizeLocal);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Header: ', error);
    return { hasError: true };
  }

  handleResizeLocal () {
    if (handleResize('Header')) {
      this.setState({});
    }
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    // console.log('------ Header, onAppObservableStoreChange received: ', msg);
    this.setState({
      activityTidbitWeVoteIdForDrawer: AppObservableStore.getActivityTidbitWeVoteIdForDrawer(),
    });
  }

  hideHeader () {
    const path = normalizedHref();
    return (
      // path.startsWith('/-') || // Shared item
      path.startsWith('/findfriends') ||
      path.startsWith('/for-campaigns') ||
      path.startsWith('/how/for-campaigns') ||
      path.startsWith('/more/about') ||
      path.startsWith('/more/credits') ||
      path.startsWith('/setupaccount') ||
      (path.startsWith('/start-a-campaign') && (path !== '/start-a-campaign')) ||
      (path.startsWith('/start-a-challenge') && (path !== '/start-a-challenge')) ||
      path.startsWith('/twitter_sign_in') ||
      path.startsWith('/unsubscribe') ||
      path.startsWith('/wevoteintro') ||
      path.startsWith('/welcomehome')
    );
  }


  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    if (this.hideHeader()) {
      renderLog('Header hidden');
      return null;
    }

    // const {
    //   headerNotVisible, settingsMode, valuesMode, voterGuideCreatorMode, voterGuideMode,
    //   showBackToBallotHeader, showBackToSettingsDesktop,
    //   showBackToSettingsMobile, showBackToValues, showBackToVoterGuide, showBackToVoterGuides,
    // } = getApplicationViewBooleans(pathname);
    // const voter = VoterStore.getVoter();

    // console.log('organizationModalBallotItemWeVoteId: ', organizationModalBallotItemWeVoteId);

    let pageHeaderClasses = '';
    // let pageHeaderClasses = weVoteBrandingOff() ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    // if (isIPad() && !isIOSAppOnMac()) {
    //   pageHeaderClasses = pageHeaderClasses.replace('page-header__container', 'page-header__container_ipad');
    // }
    if (isCordova()) {
      pageHeaderClasses = '';   // Abandoning the main.css styles if cordova 10/2/2021
    }
    // Non-functional class, to provide a reminder about how to debug top margins
    pageHeaderClasses += pageHeaderClasses.length ? ' cordovaTopHeaderTopMargin' : 'cordovaTopHeaderTopMargin';

    // console.log('voterGuideMode:', voterGuideMode, ', showBackToVoterGuide:', showBackToVoterGuide, ', showBackToVoterGuides:', showBackToVoterGuides, ', showBackToBallotHeader:', showBackToBallotHeader, ', settingsMode:', settingsMode);
    const headerBarObject = <div />;
    return (
      <div id="app-header">
        <IPhoneSpacer />
        <HeadroomWrapper id="hw1">
          <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
            <Suspense fallback={<></>}>
              {headerBarObject}
            </Suspense>
          </div>
        </HeadroomWrapper>
      </div>
    );
  }
}
Header.propTypes = {
  hideHeader: PropTypes.bool,
  params: PropTypes.object,
  // pathname: PropTypes.string,
};

