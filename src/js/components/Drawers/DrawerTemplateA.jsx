import { Close } from '@mui/icons-material'; // Info
import { Drawer, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { DrawerHeaderAnimateDownInnerContainer, DrawerHeaderAnimateDownOuterContainer, DrawerTitle, DrawerHeaderWrapper } from '../Style/drawerLayoutStyles';
import { cordovaDrawerTopMargin } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
// import { useStateContext } from '../../contexts/KeyValCont';



const DrawerTemplateA = ({ classes, drawerId, drawerOpenGlobalVariableName, headerFixedJsx, headerTitleJsx, mainContentJsx }) => {  //  classes, teamId
  renderLog(`DrawerTemplateA (${drawerId})`);  // Set LOG_RENDER_EVENTS to log all renders
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolledDown, setScrolledDown] = React.useState(false);
  const { getAppContextData, setAppContextValue, getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes


  const handleScrolledDownDrawer = (evt) => {
    const { scrollTop } = evt.target;
    if (scrollTop > 200 && !getAppContextValue('scrolledDownDrawer')) {
      setAppContextValue('scrolledDownDrawer', true);
    }
    if (scrollTop < 200 && getAppContextValue('scrolledDownDrawer')) {
      setAppContextValue('scrolledDownDrawer', false);
    }
  };

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('DrawerTemplateA: Context value changed: ', drawerId);
    setScrolledDown(getAppContextValue('scrolledDownDrawer'));
    setDrawerOpen(getAppContextValue('drawerOpenGlobalVariableName'));
  }, [getAppContextData]);

  // const onAppObservableStoreChange = () => {
  //   setScrolledDown(getAppContextValue('scrolledDownDrawer'));
  //   setDrawerOpen(getAppContextValue('drawerOpenGlobalVariableName'));
  // };

  React.useEffect(() => {
    // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    // onAppObservableStoreChange();

    setTimeout(() => {
      const drawer = document.querySelector('.MuiDrawer-paper');
      if (drawer) {
        drawer.addEventListener('scroll', handleScrolledDownDrawer);
      } else {
        console.log('Drawer element NOT found make timeout longer.');
      }
    }, 100);

    return () => {
      // appStateSubscription.unsubscribe();
    };
  }, []);

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      direction="left"
      id={drawerId}
      onClose={() => setAppContextValue(drawerOpenGlobalVariableName, false)}
      open={drawerOpen}
    >
      <DrawerHeaderWrapper>
        <DrawerTitle>
          {headerTitleJsx}
        </DrawerTitle>
        <CloseDrawerIconWrapper>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            id={`${drawerId}Close`}
            onClick={() => setAppContextValue(drawerOpenGlobalVariableName, false)}
            size="large"
          >
            <span className="u-cursor--pointer">
              <Close classes={{ root: classes.closeIcon }} />
            </span>
          </IconButton>
        </CloseDrawerIconWrapper>
      </DrawerHeaderWrapper>
      <DrawerHeaderAnimateDownOuterContainer id={`${drawerId}AnimateDownId`} scrolledDown={scrolledDown}>
        <DrawerHeaderAnimateDownInnerContainer>
          {headerFixedJsx}
        </DrawerHeaderAnimateDownInnerContainer>
      </DrawerHeaderAnimateDownOuterContainer>
      <DrawerTemplateAWrapper>
        {mainContentJsx}
      </DrawerTemplateAWrapper>
    </Drawer>
  );
};
DrawerTemplateA.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerId: PropTypes.string,
  drawerOpenGlobalVariableName: PropTypes.string,
  mainContentJsx: PropTypes.object,
  headerTitleJsx: PropTypes.object,
  headerFixedJsx: PropTypes.object,
};

const styles = () => ({
  drawer: {
    marginTop: cordovaDrawerTopMargin(),
    maxWidth: '550px !important',
    '& *': {
      maxWidth: '550px !important',
    },
    '@media(max-width: 576px)': {
      maxWidth: '360px !important',
      '& *': {
        maxWidth: '360px !important',
      },
    },
  },
  dialogPaper: {
    display: 'block',
    marginTop: hasIPhoneNotch() ? 68 : 48,
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
    '@media (min-width: 577px)': {
      maxWidth: '550px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    '@media (max-width: 576px)': {
      maxWidth: '360px',
    },
  },
  dialogContent: {
    padding: '24px 24px 36px 24px',
    background: 'white',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '@media(max-width: 576px)': {
      justifyContent: 'flex-start !important',
    },
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginRight: 'auto',
    padding: 6,
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  closeIcon: {
    color: '#999',
    width: 24,
    height: 24,
  },
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const DrawerTemplateAWrapper = styled('div')`
  margin: 0 15px;
  min-width: 300px;
`;

const CloseDrawerIconWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

export default withStyles(styles)(DrawerTemplateA);
