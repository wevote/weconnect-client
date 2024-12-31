import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { renderLog } from '../../common/utils/logging';


// eslint-disable-next-line no-unused-vars
const TeamHeader = ({ classes, showHeaderLabels, team }) => {
  renderLog('TeamHeader');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <OneTeamHeader>
      {/* Width (below) of this TeamHeaderCell comes from the combined widths of the first x columns in TeamMemberList */}
      <TeamHeaderCell largeFont titleCell width={15 + 150 + 125}>
        {team && (
          <Link to={`/team-home/${team.id}`}>
            {team.teamName}
          </Link>
        )}
      </TeamHeaderCell>
      {showHeaderLabels && (
        <TeamHeaderCell width={190}>
          Title / Volunteering Love
        </TeamHeaderCell>
      )}
      {/* Edit icon */}
      {showHeaderLabels && (
        <TeamHeaderCell width={20} />
      )}
      {/* Delete icon */}
      {showHeaderLabels && (
        <TeamHeaderCell width={20} />
      )}
    </OneTeamHeader>
  );
};
TeamHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  showHeaderLabels: PropTypes.bool,
  team: PropTypes.object.isRequired,
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

const OneTeamHeader = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const TeamHeaderCell = styled('div', {
  shouldForwardProp: (prop) => !['largeFont', 'titleCell', 'width'].includes(prop),
})(({ largeFont, titleCell, width }) => (`
  align-content: center;
  ${(titleCell) ? '' : 'border-bottom: 1px solid #ccc;'}
  ${(largeFont) ? 'font-size: 1.1em;' : 'font-size: .8em;'};
  ${(titleCell) ? '' : 'font-weight: 550;'}
  height: 22px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

export default withStyles(styles)(TeamHeader);
