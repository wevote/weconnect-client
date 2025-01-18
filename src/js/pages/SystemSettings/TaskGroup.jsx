import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import useFetchData from '../../react-query/fetchData';


// eslint-disable-next-line no-unused-vars
const TaskGroup = ({ classes, match }) => {
  renderLog('TaskGroup');
  const { setAppContextValue } = useConnectAppContext();

  const [taskGroupId] = React.useState(parseInt(useParams().taskGroupId));
  const [taskGroup, setTaskGroup] = React.useState(undefined);

  const [taskDefinitionList, setTaskDefinitionList] = React.useState(undefined);

  const { data: dataTSL, isSuccess: isSuccessTSL, isFetching: isFetchingTSL } = useFetchData(['task-status-list-retrieve'], {});
  useEffect(() => {
    if (isSuccessTSL) {
      console.log('useFetchData in TeamHome (task-group-retrieve) useEffect data good:', dataTSL);
      // We don't need this list for this object, but extracting as an example for other objects
      // setTaskGroupList(dataTSL ? dataTSL.taskGroupList : {});
      setTaskDefinitionList(dataTSL ? dataTSL.taskDefinitionList : undefined);
      // We don't need this list for this object, but extracting as an example for other objects
      // setTaskList(dataTSL ? dataTSL.taskList : []);
      const oneGroup = dataTSL.taskList.find((group) => group.taskGroupId === parseInt(taskGroupId));
      setTaskGroup(oneGroup);
    }
  }, [dataTSL, isSuccessTSL, isFetchingTSL]);


  const addTaskDefinitionClick = () => {
    setAppContextValue('editTaskDefinitionDrawerOpen', true);
    setAppContextValue('editTaskDefinitionDrawerTaskDefinitionId', -1);
    setAppContextValue('editTaskDefinitionDrawerTaskGroup', taskGroup);
  };

  // eslint-disable-next-line no-unused-vars
  const editTaskDefinitionClick = (taskDefinition) => {
    setAppContextValue('editTaskDefinitionDrawerOpen', true);
    setAppContextValue('editTaskDefinitionDrawerTaskDefinition', taskDefinition);
    setAppContextValue('editTaskDefinitionDrawerTaskGroup', taskGroup);
  };

  const editTaskGroupClick = () => {
    // const { params } = match;
    // const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', taskGroupIdTemp);
  };

  return (
    <>
      <Helmet>
        <title>
          TaskGroup Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/task-group/${taskGroupId}`} />
      </Helmet>
      <PageContentContainer>
        <TaskGroupTitleWrapper>
          <Link to="/system-settings">TaskGroups</Link>
          {' '}
          &gt;
          {' '}
          {taskGroup && taskGroup.taskGroupName}
          <SpanWithLinkStyle onClick={editTaskGroupClick}>
            <EditStyled />
          </SpanWithLinkStyle>
        </TaskGroupTitleWrapper>
        {taskGroup && taskGroup.taskGroupDescription && (
          <InstructionsWrapper>
            {taskGroup.taskGroupDescription}
          </InstructionsWrapper>
        )}
        <TaskDefinitionListWrapper>
          {taskDefinitionList && taskDefinitionList.map((taskDefinition) => (
            <OneTaskGroupWrapper key={`taskDefinition-${taskDefinition.id}`}>
              {taskDefinition.taskName}
              {' '}
              <SpanWithLinkStyle onClick={() => editTaskDefinitionClick(taskDefinition)}>
                <EditStyled />
              </SpanWithLinkStyle>
            </OneTaskGroupWrapper>
          ))}
        </TaskDefinitionListWrapper>
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addTaskGroupButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addTaskDefinitionClick}
          >
            Add Task
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </>
  );
};
TaskGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTaskGroupButtonRoot: {
    width: 185,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const TaskGroupTitleWrapper = styled('div')`
  height: 100px;
  align-content: center;
`;

const AddButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const EditStyled = styled(Edit)`
  color: ${DesignTokenColors.neutral100};
  height: 16px;
  margin-left: 2px;
  width: 16px;
`;

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
`;

const OneTaskGroupWrapper = styled('div')`
  margin-bottom: 20px;
`;

const TaskDefinitionListWrapper = styled('div')`
  margin-top: 24px;
  padding-bottom: 24px;
`;

// const RequiredStar = styled('span')`
//   color: ${DesignTokenColors.alert800};
//   font-weight: bold;
// `;

// const TitleWrapper = styled('h1')`
//   line-height: 1.1;
//   margin-bottom: 8px;
// `;

export default withStyles(styles)(TaskGroup);
