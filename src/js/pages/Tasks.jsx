import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import PersonStore from '../stores/PersonStore';
import TaskActions from '../actions/TaskActions';
import TaskStore from '../stores/TaskStore';
import TeamActions from '../actions/TeamActions';
import TeamStore from '../stores/TeamStore';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import PersonSummaryHeader from '../components/Person/PersonSummaryHeader';
import PersonSummaryRow from '../components/Person/PersonSummaryRow';
import TaskListForPerson from '../components/Task/TaskListForPerson';
import webAppConfig from '../config';
import apiCalming from '../common/utils/apiCalming';
import { renderLog } from '../common/utils/logging';


const Tasks = ({ classes, match }) => {  //  classes, teamId
  renderLog('Tasks');  // Set LOG_RENDER_EVENTS to log all renders
  const [showCompletedTasks, setShowCompletedTasks] = React.useState(true);
  const [personList, setPersonList] = React.useState([]);
  const [taskListDictByPersonId, setTaskListDictByPersonId] = React.useState({});
  const [teamCount, setTeamCount] = React.useState(0);

  const onAppObservableStoreChange = () => {
  };

  const onRetrieveTaskStatusListChange = () => {
    const personListTemp = PersonStore.getAllCachedPeopleList();
    const taskListDictByPersonIdTemp = {};
    for (let i = 0; i < personListTemp.length; i++) {
      const person = personListTemp[i];
      taskListDictByPersonIdTemp[person.personId] = TaskStore.getTaskListForPerson(person.personId);
    }
    setTaskListDictByPersonId(taskListDictByPersonIdTemp);
  };

  const onPersonStoreChange = () => {
    onRetrieveTaskStatusListChange();
    const personListTemp = PersonStore.getAllCachedPeopleList();
    setPersonList(personListTemp);
  };

  const onTaskStoreChange = () => {
    onRetrieveTaskStatusListChange();
  };

  const onTeamStoreChange = () => {
    onRetrieveTaskStatusListChange();
  };

  const addTeamClick = () => {
    AppObservableStore.setGlobalVariableState('addTeamDrawerOpen', true);
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const taskStoreListener = TaskStore.addListener(onTaskStoreChange);
    onTaskStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    if (apiCalming('taskStatusListRetrieve', 1000)) {
      TaskActions.taskStatusListRetrieve();
    }

    if (apiCalming('teamListRetrieve', 1000)) {
      // Needed?
      TeamActions.teamListRetrieve();
    }

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      taskStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          Tasks -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} />
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
        {personList.map((person, index) => (
          <OneTeamWrapper key={`team-${person.id}`}>
            <PersonSummaryRow person={person} />
            <TaskListForPerson personId={person.id} />
          </OneTeamWrapper>
        ))}
      </PageContentContainer>
    </div>
  );
};
Tasks.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
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
