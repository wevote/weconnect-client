import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { handleResize } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import { messageService } from '../../stores/AppObservableStore';
import cordovaTopHeaderTopMargin from '../../utils/cordovaTopHeaderTopMargin';
import { HeadroomWrapper } from '../Style/pageLayoutStyles';
import IPhoneSpacer from '../Widgets/IPhoneSpacer';
import HeaderBar from './HeaderBar';


const Header = ({ hideHeader }) => {
  renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders
  const [pageHeaderClasses, setPageHeaderClasses] = useState('');

  const handleResizeLocal = () => {
    if (handleResize('Header')) {
      // this.setState({});
    }
  };

  const onAppObservableStoreChange = () => {
    // console.log('------ Header, onAppObservableStoreChange received: ', msg);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    window.addEventListener('resize', handleResizeLocal);

    let pageHeaderClassesTemp = '';
    if (isCordova()) {
      pageHeaderClassesTemp = '';   // Abandoning the main.css styles if cordova 10/2/2021
    }
    // Non-functional class, to provide a reminder about how to debug top margins
    pageHeaderClassesTemp += pageHeaderClassesTemp.length ? ' cordovaTopHeaderTopMargin' : 'cordovaTopHeaderTopMargin';
    setPageHeaderClasses(pageHeaderClassesTemp);

    return () => {
      appStateSubscription.unsubscribe();
      window.removeEventListener('resize', handleResizeLocal);
    };
  }, []);

  return (
    <div id="app-header">
      <IPhoneSpacer />
      <HeadroomWrapper id="hw1">
        <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
          <HeaderBar style={hideHeader ? { display: 'none' } : { display: 'unset' }} />
        </div>
      </HeadroomWrapper>
    </div>
  );
};
Header.propTypes = {
  hideHeader: PropTypes.bool,
};

export default Header;
