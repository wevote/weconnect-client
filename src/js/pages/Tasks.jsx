import { CircularProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { renderLog } from '../common/utils/logging';
import PersonSummaryHeader from '../components/Person/PersonSummaryHeader';
import PersonSummaryRow from '../components/Person/PersonSummaryRow';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TaskListForPerson from '../components/Task/TaskListForPerson';
import webAppConfig from '../config';
import useFetchData from '../react-query/fetchData';


// eslint-disable-next-line no-unused-vars
const Tasks = ({ classes, match }) => {
  renderLog('Tasks');  // Set LOG_RENDER_EVENTS to log all renders

  const [showCompletedTasks, setShowCompletedTasks] = React.useState(false);
  const [taskList, setTaskList] = React.useState(undefined);
  const [taskDefinitionList, setTaskDefinitionList] = React.useState(undefined);
  const [allStaffList, setAllStaffList] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState([false]);
  let personIdsList;

  // Roughly equivalent to PersonStore.getAllCachedPeopleList(); and TaskActions.taskStatusListRetrieve();
  const { data: dataPerson, isSuccess: isSuccessPerson, isFetching: isFetchingPerson } = useFetchData(['person-list-retrieve'], {});
  useEffect(() => {
    if (dataPerson) {
      personIdsList = dataPerson.personList.map((dataPersonObj) => dataPersonObj.id);
      setAllStaffList(dataPerson.personList);
    }
  }, [dataPerson, isSuccessPerson]);

  const { data: dataTask, isSuccess: isSuccessTask, isFetching: isFetchingTask } = useFetchData(['task-status-list-retrieve'], { personIdList: personIdsList });
  useEffect(() => {
    console.log('useFetchData in Tasks (person-list-retrieve) useEffect:', isSuccessPerson, isFetchingPerson, dataPerson);
    console.log('useFetchData in Tasks (task-status-list-retrieve) useEffect:', isSuccessTask, isFetchingTask, dataTask);
    setIsFetching(isFetchingTask || isFetchingPerson);
    if (isSuccessPerson && isSuccessTask) {
      setTaskDefinitionList(dataTask.taskDefinitionList);
      setTaskList(dataTask.taskList);
    }
  }, [personIdsList, dataTask, isSuccessPerson, isSuccessTask]);

  if (taskDefinitionList) {
    const test = taskDefinitionList.filter((taskDefEntry) => taskDefEntry.personId === 1);
    console.log(test);
  }
  const teamId = 0;  // hack 1/15/25
  return (
    <div>
      <Helmet>
        <title>
          Tasks -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/*  Executing a link to a full url restarts the session, <Link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} /> */}
        {/* Latest Helmet wont take a link or Link, <Link to="/team-home">Home</Link> */}
        {/* browser.js:38 Uncaught Invariant Violation: Only elements types base, body, head, html, link, meta, noscript, script, style, title, Symbol(react.fragment) are allowed. Helmet does not support rendering <[object Object]> elements. Refer to our API for more information. */}
      </Helmet>
      <PageContentContainer>
        <h1>Dashboard</h1>
        <div>
          {showCompletedTasks ? (
            <SpanWithLinkStyle onClick={() => setShowCompletedTasks(false)}>hide completed</SpanWithLinkStyle>
          ) : (
            <SpanWithLinkStyle onClick={() => setShowCompletedTasks(true)}>show completed</SpanWithLinkStyle>
          )}
        </div>
        <PersonSummaryHeader />
        {isFetching && (
          <div style={{ padding: '50px 30px 30px 320px' }}>
            <CircularProgress />
          </div>
        )}
        {taskList && allStaffList.map((person) => (
          <OneTeamWrapper key={`team-${person.personId}`}>
            <PersonSummaryRow person={person} teamId={teamId} />
            <TaskListForPerson
              personId={person.personId}
              showCompletedTasks={showCompletedTasks}
              taskDefinitionList={taskDefinitionList}
              taskListForPersonId={taskList.filter((taskEntry) => taskEntry.personId === person.personId)}
            />
          </OneTeamWrapper>
        ))}
      </PageContentContainer>
    </div>
  );
};
Tasks.propTypes = {
  classes: PropTypes.object.isRequired,
  // match: PropTypes.object.isRequired,
  match: PropTypes.object,
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

const OneTeamWrapper = styled('div')`
`;

export default withStyles(styles)(Tasks);
