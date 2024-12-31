import React, { Suspense } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Launch } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import QuestionnaireStore from '../../stores/QuestionnaireStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import CopyQuestionnaireLink from './CopyQuestionnaireLink';
import webAppConfig from '../../config';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const QuestionnaireResponsesList = ({ personId }) => {
  renderLog('QuestionnaireList');  // Set LOG_RENDER_EVENTS to log all renders
  const [questionnaireList, setQuestionnaireList] = React.useState([]);

  const onQuestionnaireStoreChange = () => {
    const questionnaireListTemp = QuestionnaireStore.getQuestionnaireListByPersonId(personId);
    // console.log('QuestionnaireList QuestionnaireStore.getQuestionnaireListByPersonId:', questionnaireListTemp);
    const dateQuestionnairesCompletedDictTemp = QuestionnaireStore.getDateQuestionnairesCompletedDictByPersonId(personId);
    const questionnaireListTempModified = [];
    for (let i = 0; i < questionnaireListTemp.length; i++) {
      const questionnaire = questionnaireListTemp[i];
      if (dateQuestionnairesCompletedDictTemp[questionnaire.questionnaireId]) {
        questionnaire.dateQuestionnaireCompleted = new Date(dateQuestionnairesCompletedDictTemp[questionnaire.questionnaireId]);
      } else {
        questionnaire.dateQuestionnaireCompleted = null;
      }
      // console.log('QuestionnaireList questionnaire:', questionnaire);
      questionnaireListTempModified[i] = questionnaire;
    }
    setQuestionnaireList(questionnaireListTempModified);
  };

  React.useEffect(() => {
    const questionnaireStoreListener = QuestionnaireStore.addListener(onQuestionnaireStoreChange);
    onQuestionnaireStoreChange();

    if (personId >= 0) {
      const personIdList = [personId];
      if (apiCalming(`questionnaireResponsesListRetrieve-${personId}`, 10000)) {
        QuestionnaireActions.questionnaireResponsesListRetrieve(personIdList);
      }
    }

    return () => {
      questionnaireStoreListener.remove();
    };
  }, []);

  return (
    <div>
      {questionnaireList.length > 0 && (
        <QuestionnaireListWrapper>
          Questionnaire Responses
          {questionnaireList.map((questionnaire) => (
            <OneQuestionnaireWrapper key={`questionnaire-${questionnaire.id}`}>
              <QuestionText>
                {questionnaire.questionnaireName}
              </QuestionText>
              <CopyQuestionnaireLink personId={personId} questionnaireId={questionnaire.id} />
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="view answers"
                  url={`${webAppConfig.PROTOCOL}${webAppConfig.HOSTNAME}/answers/${questionnaire.id}/${personId}`}
                  target="_blank"
                  body={(
                    <Tooltip title="View answers">
                      view
                      <LaunchStyled />
                    </Tooltip>
                  )}
                />
              </Suspense>
              {questionnaire.dateQuestionnaireCompleted && (
                <WhenCompleted>
                  Completed on
                  {' '}
                  {questionnaire.dateQuestionnaireCompleted.toLocaleString('en-US', {})}
                </WhenCompleted>
              )}
            </OneQuestionnaireWrapper>
          ))}
        </QuestionnaireListWrapper>
      )}
    </div>
  );
};
QuestionnaireResponsesList.propTypes = {
  personId: PropTypes.number,
};

const LaunchStyled = styled(Launch)`
  height: 14px;
  margin-left: 2px;
  margin-top: -3px;
  width: 14px;
`;

const WhenCompleted = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: .9em;
`;

const OneQuestionnaireWrapper = styled('div')`
  font-weight: 550;
  margin-top: 6px;
`;

const QuestionText = styled('div')`
`;

const QuestionnaireListWrapper = styled('div')`
  margin-top: 30px;
`;

export default QuestionnaireResponsesList;
