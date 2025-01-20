import PropTypes from 'prop-types';
import React from 'react';
// import { Link } from 'react-router';
import styled from 'styled-components';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderLogoImage from './HeaderLogoImage';


const logoLight = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

const HeaderBarLogo = ({ light, linkOff }) => (
  <HeaderBarLogoWrapper id="HeaderBarLogoWrapper">
    <WeVoteLogoWrapper>
      {linkOff ? (
        <HeaderLogoImage src={light ? normalizedImagePath(logoLight) : normalizedImagePath(logoDark)} />
      ) : (
        // Hack 1/14/25
        <></>
        // <Link to="/" id="logoHeaderBar">
        //   <HeaderLogoImage src={light ? normalizedImagePath(logoLight) : normalizedImagePath(logoDark)} />
        // </Link>
      )}
    </WeVoteLogoWrapper>
  </HeaderBarLogoWrapper>
);

HeaderBarLogo.propTypes = {
  light: PropTypes.bool,
  linkOff: PropTypes.bool,
};

const HeaderBarLogoWrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    padding-top: 5px;
  }

  @media print{
  }
`));

const WeVoteLogoWrapper = styled('div')`
`;

export default HeaderBarLogo;
