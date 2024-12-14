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

/* global $  */

const Login = ({ classes }) => {
  const nameFldRef = useRef('');
  const locationFldRef = useRef('');
  const emailFldRef = useRef('');
  const email2FldRef = useRef('');
  const passwordFldRef = useRef('');
  const confirmPasswordFldRef = useRef('');
  const [showCreateStuff, setShowCreateStuff] = React.useState(false);
  const [warningLine, setWarningLine] = React.useState('');
  const [successLine, setSuccessLine] = React.useState('');

  renderLog('Login');  // Set LOG_RENDER_EVENTS to log all renders

  const loginApi = (email, password) => {
    console.log(`${webAppConfig.WECONNECT_SERVER_API_ROOT_URL}login`);
    $.post(`${webAppConfig.WECONNECT_SERVER_API_ROOT_URL}login/`,
      { email, password },
      (data, status) => {
        console.log(`/login response -- status: '${status}',  data: ${JSON.stringify(data)}`);
        if (data.userId > 0) {
          setWarningLine('');
          setSuccessLine(`Cheers! &nbsp;You are signed in! &nbsp;Person #${data.userId}.`);
        } else {
          setWarningLine(data.errors.msg);
          setSuccessLine('');
        }
      });
  };

  const signupApi = (name, location, email, email2, password, confirmPassword) => {
    $.post(`${webAppConfig.WECONNECT_SERVER_API_ROOT_URL}signup`,
      { name, location, email, email2, password, confirmPassword },
      (data, status) => {
        console.log(`/signup response -- status: '${status}',  data: ${JSON.stringify(data)}`);
        let errStr = '';
        for (let i = 0; i < data.errors.length; i++) {
          errStr += data.errors[i].msg;
        }
        setWarningLine(errStr);
        if (data.personCreated) {
          setSuccessLine(`user # ${data.userId} created, and signedIn is ${data.signedIn}`);
        }
      });
  };

  const loginPressed = () => {
    const email =  emailFldRef.current.value;
    const password = passwordFldRef.current.value;

    if (email.length === 0 || password.length === 0) {
      console.log('too short');
      setWarningLine('Enter a valid username and password');
    } else {
      setWarningLine('');
      loginApi(email, password);
    }
  };

  const createPressed = () => {
    if (!showCreateStuff) {
      setShowCreateStuff(true);
      setWarningLine('');
      setSuccessLine('');
    } else {
      setWarningLine('');
      let errStr = '';
      const name =  nameFldRef.current.value;
      const location =  locationFldRef.current.value;
      const email =  emailFldRef.current.value;
      const email2 =  email2FldRef.current.value;
      const password = passwordFldRef.current.value;
      const confirmPassword = confirmPasswordFldRef.current.value;
      if (!validator.isEmail(email)) errStr += 'Please enter a valid primary email address.';
      if (!validator.isEmail(email2)) errStr += 'Please enter a valid secondary email address.';
      if (!validator.isLength(password, { min: 8 })) errStr += 'Password must be at least 8 characters long';
      if (validator.escape(password) !== validator.escape(confirmPassword)) errStr += 'Passwords do not match';

      if (errStr.length) {
        setWarningLine(errStr);
      } else {
        signupApi(name, location, email, email2, password, confirmPassword);
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
        <h1>
          Sign in
        </h1>

        <div id="warningLine" style={{ color: 'red', paddingTop: '10px', paddingBottom: '20px' }}>{warningLine}</div>
        <div id="successLine" style={{ color: 'green', paddingTop: '10px', paddingBottom: '20px' }}>{successLine}</div>
        <TextField id="outlined-basic"
                   label="Name"
                   variant="outlined"
                   inputRef={nameFldRef}
                   sx={{ paddingBottom: '15px',
                     display: showCreateStuff ? 'block' : 'none'  }}
        />
        <TextField id="outlined-basic"
                   label="Location"
                   variant="outlined"
                   inputRef={locationFldRef}
                   helperText="City, State (2 chars)"
                   sx={{ paddingBottom: '15px',
                     display: showCreateStuff ? 'block' : 'none'  }}
        />
        <TextField id="outlined-basic"
                   label="Email"
                   helperText={showCreateStuff ? 'Required, possibly your personal email' : ''}
                   variant="outlined"
                   inputRef={emailFldRef}
                   sx={{ display: 'block', paddingBottom: '15px' }}
        />
        <TextField id="outlined-basic"
                   label="Second Email"
                   helperText="Optional, possibly your wevote.us email"
                   variant="outlined"
                   inputRef={email2FldRef}
                   sx={{ paddingBottom: '15px',
                     display: showCreateStuff ? 'block' : 'none' }}
        />
        <TextField id="outlined-basic"
                   label="Password"
                   variant="outlined"
                   inputRef={passwordFldRef}
                   sx={{ display: 'block', paddingBottom: '15px' }}
        />
        <TextField id="outlined-basic"
                   label="Confirm Password"
                   variant="outlined"
                   inputRef={confirmPasswordFldRef}
                   sx={{ paddingBottom: '15px', display: showCreateStuff ? 'block' : 'none'  }}
        />
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

        <div style={{ paddingTop: '80px' }}>
          This page&apos;s purpose is to test and exercise the API.  Feel free to replace me.
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
