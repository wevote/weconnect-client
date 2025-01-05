import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { renderLog } from '../../common/utils/logging';
import PersonStore from '../../stores/PersonStore';


const PersonHeader = ({ showHeaderLabels, person }) => {
  renderLog('PersonHeader');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <OnePersonHeader>
      {/* Width (below) of this PersonHeaderCell comes from the combined widths of the first x columns in PersonMemberList */}
      <PersonHeaderCell largeFont titleCell width={15 + 150 + 125}>
        {person && (
          <Link to={`/person-home/${person.id}`}>
            {PersonStore.getFullNamePreferred(person.personId)}
          </Link>
        )}
      </PersonHeaderCell>
      {showHeaderLabels && (
        <PersonHeaderCell width={190}>
          Title / Volunteering Love
        </PersonHeaderCell>
      )}
      {/* Edit icon */}
      {showHeaderLabels && (
        <PersonHeaderCell width={20} />
      )}
      {/* Delete icon */}
      {showHeaderLabels && (
        <PersonHeaderCell width={20} />
      )}
    </OnePersonHeader>
  );
};
PersonHeader.propTypes = {
  showHeaderLabels: PropTypes.bool,
  person: PropTypes.object,
};

const OnePersonHeader = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const PersonHeaderCell = styled('div', {
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

export default PersonHeader;
