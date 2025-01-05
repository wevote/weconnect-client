import { Button, TextField } from '@mui/material';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import validator from 'validator';
import { withStyles } from '@mui/styles';
import styled from 'styled-components';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';
import { renderLog } from '../common/utils/logging';
import historyPush from '../common/utils/historyPush';

/* global $  */

const Login = ({ classes }) => {
  const firstNameFldRef = useRef('');
  const lastNameFldRef = useRef('');
  const emailPersonalFldRef = useRef('');
  const emailOfficialFldRef = useRef('');
  const locationFldRef = useRef('');
  // const zipFldRef = useRef('');
  // const stateFldRef = useRef('');
  const passwordFldRef = useRef('');
  const confirmPasswordFldRef = useRef('');
  const [showCreateStuff, setShowCreateStuff] = React.useState(false);
  const [warningLine, setWarningLine] = React.useState('');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const initialSuccess = isAuthenticated ? `Signed in as ${isAuthenticated}` : 'Please sign in';
  const [successLine, setSuccessLine] = React.useState(initialSuccess);

  renderLog('Login');  // Set LOG_RENDER_EVENTS to log all renders

  const loginApi = (email, password) => {
    if (!validator.isEmail(email)) {
      setWarningLine('Please enter a valid email address.');
      return;
    }
    if (validator.isEmpty(password)) {
      setWarningLine('Password cannot be blank.');
      return;
    }

    console.log(`${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}login`);
    $.post(`${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}login/`,
      { email, password },
      (data, status) => {
        console.log(`/login response -- status: '${status}',  data: ${JSON.stringify(data)}`);
        if (data.userId > 0) {
          setWarningLine('');
          setSuccessLine(`Cheers person #${data.userId}!  You are signed in!`);
          localStorage.setItem('isAuthenticated', data.userId);
        } else {
          setWarningLine(data.errors.msg);
          setSuccessLine('');
        }
      });
  };

  const logoutApi = () => {
    console.log(`${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}logout`);
    $.post(`${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}logout/`,
      {},
      (data, status) => {
        console.log(`/logout response -- status: '${status}',  data: ${JSON.stringify(data)}`);
        if (data.authenticated) {
          setWarningLine(data.errors.msg);
          setSuccessLine('');
        } else {
          setWarningLine('');
          setSuccessLine('You are signed out');
          localStorage.removeItem('isAuthenticated');
        }
      });
  };

  const signupApi = (firstName, lastName, location, emailPersonal, emailOfficial, password, confirmPassword) => {
    const postURL = `${webAppConfig.STAFF_API_SERVER_API_ROOT_URL}signup`;
    console.log('postURL: ', postURL);
    try {
      $.post(postURL,
        {
          firstName,
          lastName,
          location,
          emailPersonal,
          emailOfficial,
          password,
          confirmPassword,
        },
        (data, status) => {
          console.log(`/signup response -- status: '${status}',  data: ${JSON.stringify(data)}`);
          let errStr = '';
          for (let i = 0; i < data.errors.length; i++) {
            errStr += data.errors[i].msg;
          }
          setWarningLine(errStr);
          if (data.personCreated) {
            setSuccessLine(`user # ${data.userId} created, and signedIn is ${data.signedIn}`);
            localStorage.setItem('isAuthenticated', data.userId);
          }
        });
    } catch (e) {
      console.log('signup error', e);
    }
  };

  const loginPressed = () => {
    const email =  emailPersonalFldRef.current.value;
    const password = passwordFldRef.current.value;

    if (email.length === 0 || password.length === 0) {
      console.log('too short');
      setWarningLine('Enter a valid username and password');
    } else {
      setWarningLine('');
      loginApi(email, password);
    }
  };

  const signOutPressed = () => {
    logoutApi();
  };

  const createPressed = () => {
    if (!showCreateStuff) {
      setShowCreateStuff(true);
      setWarningLine('');
      setSuccessLine('');
    } else {
      setWarningLine('');
      let errStr = '';
      const firstName =  firstNameFldRef.current.value;
      const lastName =  lastNameFldRef.current.value;
      const location =  locationFldRef.current.value;
      const emailPersonal =  emailPersonalFldRef.current.value;
      const emailOfficial =  emailOfficialFldRef.current.value;
      // const zipCode =  zipFldRef.current.value;
      // const stateCode =  stateFldRef.current.value;
      const password = passwordFldRef.current.value;
      const confirmPassword = confirmPasswordFldRef.current.value;
      if (!validator.isEmail(emailPersonal)) errStr += 'Please enter a valid personal email address.';
      if (emailOfficial.length > 0 && !validator.isEmail(emailOfficial)) errStr += 'Please enter a valid secondary email address.';
      if (!validator.isLength(password, { min: 8 })) errStr += 'Password must be at least 8 characters long';
      if (validator.escape(password) !== validator.escape(confirmPassword)) errStr += 'Passwords do not match';

      if (errStr.length) {
        setWarningLine(errStr);
      } else {
        signupApi(firstName, lastName, location, emailPersonal, emailOfficial, password, confirmPassword);
      }
    }
  };


  return (
    <div>
      <Helmet>
        <title>
          Login -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
      </Helmet>
      <PageContentContainer>
        <div style={{ marginLeft: '40px' }}>
          <h1 style={{ display: 'inline-block' }}>
            <span style={{ float: 'left', height: '100%' }}>
              <img
                alt="we vote logo"
                width="96px"
                src="../../img/global/svg-icons/we-vote-icon-square-color-dark.svg"
              />
            </span>
            <span style={{ float: 'right', height: '100%', paddingTop: '31px' }}>
              Sign in
            </span>
          </h1>
        </div>
        <div style={{ marginLeft: '80px' }}>
          <div id="warningLine" style={{ color: 'red', paddingTop: '10px', paddingBottom: '20px' }}>{warningLine}</div>
          <div id="successLine" style={{ color: 'green', paddingTop: '10px', paddingBottom: '20px' }}>{successLine}</div>
          <span style={{ display: 'flex' }}>
            <TextField id="outlined-basic"
                       label="First Name"
                       variant="outlined"
                       inputRef={firstNameFldRef}
                       sx={{ paddingBottom: '15px',
                         paddingRight: '10px',
                         display: showCreateStuff ? 'block' : 'none'  }}
            />
            <TextField id="outlined-basic"
                       label="Last Name"
                       variant="outlined"
                       inputRef={lastNameFldRef}
                       sx={{ paddingBottom: '15px',
                         display: showCreateStuff ? 'block' : 'none'  }}
            />
          </span>
          <TextField id="outlined-basic"
                     label={showCreateStuff ? 'Your personal email' : 'Your email address'}
                     helperText={showCreateStuff ? 'Required' : ''}
                     variant="outlined"
                     inputRef={emailPersonalFldRef}
                     sx={{ display: 'block', paddingBottom: '15px' }}
          />
          <TextField id="outlined-basic"
                     label="Second Email"
                     helperText="Optional, possibly your wevote.us email"
                     variant="outlined"
                     inputRef={emailOfficialFldRef}
                     sx={{ paddingBottom: '15px',
                       display: showCreateStuff ? 'block' : 'none' }}
          />
          <TextField id="outlined-basic"
                     label="Location"
                     variant="outlined"
                     inputRef={locationFldRef}
                     helperText="City, State (2 chars)"
                     sx={{ paddingBottom: '15px',
                       display: showCreateStuff ? 'block' : 'none'  }}
          />
          <span style={{ display: 'flex' }}>
            <TextField id="outlined-basic"
                       label="Password"
                       variant="outlined"
                       inputRef={passwordFldRef}
                       defaultValue="12345678"
                       sx={{ display: 'block', paddingBottom: '15px' }}
            />
            <TextField id="outlined-basic"
                       label="Confirm Password"
                       variant="outlined"
                       inputRef={confirmPasswordFldRef}
                       defaultValue="12345678"
                       sx={{ padding: '0 0 15px 10px', display: showCreateStuff ? 'block' : 'none'  }}
            />
          </span>
          <span style={{ display: 'flex' }}>
            <Button
              classes={{ root: classes.loginButtonRoot }}
              color="primary"
              variant="contained"
              onClick={showCreateStuff ? createPressed : loginPressed}
              sx={{ paddingBottom: '15px', display: showCreateStuff ? 'none' : 'flex'  }}
            >
              Sign In
            </Button>
            <A style={{ display: showCreateStuff ? 'none' : 'flex'  }}>Forgot your password?</A>
          </span>
          <div style={{ paddingTop: '35px' }} />
          <Button
            classes={{ root: classes.buttonDesktop }}
            color="primary"
            variant="contained"
            onClick={createPressed}
          >
            {showCreateStuff ? 'Save New Account' : 'Create Account'}
          </Button>
          <div style={{ paddingTop: '35px' }} />
          <Button
            classes={{ root: classes.buttonDesktop }}
            color="primary"
            variant="contained"
            onClick={() => historyPush('/faq')}
          >
            FAQ (Requires Authentication)
          </Button>
          <div style={{ paddingTop: '35px' }} />
          <Button
            classes={{ root: classes.buttonDesktop }}
            color="primary"
            variant="contained"
            onClick={signOutPressed}
          >
            Sign Out
          </Button>
        </div>
      </PageContentContainer>
    </div>
  );
};
Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  loginButtonRoot: {
    width: 100,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const A = styled('a')`
  font-weight: 400;
  color: rgb(13, 110, 253);
  text-decoration-color: rgb(13, 110, 253);
  text-decoration-line: underline;
  padding: 8px 0 0 25px;
`;

export default withStyles(styles)(Login);
