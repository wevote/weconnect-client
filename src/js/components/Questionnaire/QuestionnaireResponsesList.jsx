import { Launch } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import useFetchData from '../../react-query/fetchData';
import CopyQuestionnaireLink from './CopyQuestionnaireLink';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const QuestionnaireResponsesList = ({ personId }) => {
  renderLog('QuestionnaireList');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();

  const [person] = useState(getAppContextValue('personDrawersPerson'));
  const [questionnaireList, setQuestionnaireList] = useState([]);

  // Although we are sending a list, there will only be one person id, if there were more, just append them with commas
  const requestParams = `personIdList[]=${person.id}`;

  const { dataQRS, isSuccessQRS, isFetchingQRS } = useFetchData(['questionnaire-responses-list-retrieve'], requestParams);
  if (isFetchingQRS) {
    console.log('isFetching  ------------ \'questionnaire-responses-list-retrieve\'');
  }
  useEffect(() => {
    if (dataQRS !== undefined && isFetchingQRS === false && person) {
      console.log('useFetchData in QuestionnaireResponsesList useEffect dataQRS is good:', dataQRS, isSuccessQRS, isFetchingQRS);
      console.log('Successfully retrieved QuestionnaireResponsesList...');

      // TODO: 1/20/25 is this questionList or questionnaireList?
      // It seems like an answered questionnaire question should be a questionAnswerList, but questionnaire and question seem tyo be used inconsistently
      // So this is hard to figure out without having some "answers" data

      // const questionnaireListTemp = dataQRS.questionAnswerList;
      // const questionnaireListTempModified = [];
      // for (let i = 0; i < questionnaireListTemp.length; i++) {
      //   const questionnaire = questionnaireListTemp[i];
      //   if (dateQuestionnairesCompletedDictTemp[questionnaire.questionnaireId]) {
      //     questionnaire.dateQuestionnaireCompleted = new Date(dateQuestionnairesCompletedDictTemp[questionnaire.questionnaireId]);
      //   } else {
      //     questionnaire.dateQuestionnaireCompleted = null;
      //   }
      //   // console.log('QuestionnaireList questionnaire:', questionnaire);
      //   questionnaireListTempModified[i] = questionnaire;
      // }
      // setQuestionnaireList(questionnaireListTempModified);

      setQuestionnaireList(dataQRS.questionAnswerList);
    }
  }, [dataQRS]);

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
                      <div>
                        view
                        <LaunchStyled />
                      </div>
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
