import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import useFetchData from '../react-query/fetchData';
import TaskStore from '../stores/TaskStore';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import PersonSummaryHeader from '../components/Person/PersonSummaryHeader';
import PersonSummaryRow from '../components/Person/PersonSummaryRow';
import TaskListForPerson from '../components/Task/TaskListForPerson';
import webAppConfig from '../config';
import { renderLog } from '../common/utils/logging';



// eslint-disable-next-line no-unused-vars
const Tasks = ({ classes, match }) => {
  renderLog('Tasks');  // Set LOG_RENDER_EVENTS to log all renders
  // const { getAppContextValue, setAppContextValue } = useConnectAppContext();

  const [showCompletedTasks, setShowCompletedTasks] = React.useState(false);
  // const [personList, setPersonList] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [taskListDictByPersonId, setTaskListDictByPersonId] = React.useState({});
  // const [teamCount, setTeamCount] = React.useState(0);
  const [allStaffList, setAllStaffList] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState([false]);

  // Roughly equivalent to PersonStore.getAllCachedPeopleList(); and TaskActions.taskStatusListRetrieve();
  const { data: dataPerson, isSuccess: isSuccessPerson, isFetching: isFetchingPerson } = useFetchData(['person-list-retrieve'], {});
  const ids = ['1', '2', '3', '4', '5'];
  const { data: dataTask, isSuccess: isSuccessTask, isFetching: isFetchingTask } = useFetchData(['task-status-list-retrieve'], { personIdList: ids });
  useEffect(() => {
    console.log('useFetchData in Tasks (person-list-retrieve) useEffect:', isSuccessPerson, isFetchingPerson, dataPerson);
    console.log('useFetchData in Tasks (task-status-list-retrieve) useEffect:', isSuccessTask, isFetchingTask, dataTask);
    setIsFetching(isFetchingTask || isFetchingPerson);
    if (isSuccessPerson && isSuccessTask) {
      const allStaff = dataPerson ? dataPerson.personList : [];
      setAllStaffList(allStaff);
      const taskListDictByPersonIdTemp = {};
      for (let i = 0; i < allStaff.length; i++) {
        const person = allStaff[i];
        taskListDictByPersonIdTemp[person.personId] = TaskStore.getTaskListForPerson(person.personId);
      }
      setTaskListDictByPersonId(taskListDictByPersonIdTemp);
    }
  }, [dataPerson, dataTask, isSuccessPerson, isSuccessTask]);


  // const onRetrieveTaskStatusListChange = () => {
  //   const personListTemp = PersonStore.getAllCachedPeopleList();
  //   const taskListDictByPersonIdTemp = {};
  //   for (let i = 0; i < personListTemp.length; i++) {
  //     const person = personListTemp[i];
  //     taskListDictByPersonIdTemp[person.personId] = TaskStore.getTaskListForPerson(person.personId);
  //   }
  //   setTaskListDictByPersonId(taskListDictByPersonIdTemp);
  // };

  // React.useEffect(() => {
  //  // TaskActions.taskStatusListRetrieve();
  //
  //  // Needed?
  //  // TeamActions.teamListRetrieve();
  //
  // }, []);

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
        {allStaffList.map((person) => (
          <OneTeamWrapper key={`team-${person.id}`}>
            <PersonSummaryRow person={person} teamId={teamId} />
            <TaskListForPerson personId={person.id} showCompletedTasks={showCompletedTasks} />
          </OneTeamWrapper>
        ))}
        <ReactQueryDevtools />
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
