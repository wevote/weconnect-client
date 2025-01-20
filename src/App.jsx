import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import styled from 'styled-components';
import { PrivateRoute } from './js/auth';
import muiTheme from './js/common/components/Style/muiTheme';
import { normalizedHref } from './js/common/utils/hrefUtils';
import initializejQuery from './js/common/utils/initializejQuery';
import { renderLog } from './js/common/utils/logging';
import Drawers from './js/components/Drawers/Drawers';
import ConnectAppContext from './js/contexts/ConnectAppContext';
import Login from './js/pages/Login';


// Root URL pages

const AnswerQuestionsForm = React.lazy(() => import(/* webpackChunkName: 'AnswerQuestionsForm' */ './js/pages/AnswerQuestionsForm'));
const FAQ = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './js/pages/FAQ'));
// const Footer = React.lazy(() => import(/* webpackChunkName: 'Footer' */ './js/components/Navigation/Footer'));
const Header = React.lazy(() => import(/* webpackChunkName: 'Header' */ './js/components/Navigation/Header'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ './js/pages/PageNotFound'));
const QuestionnaireAnswers = React.lazy(() => import(/* webpackChunkName: 'QuestionnaireAnswers' */ './js/pages/QuestionnaireAnswers'));
const QuestionnaireQuestionList = React.lazy(() => import(/* webpackChunkName: 'QuestionnaireQuestionList' */ './js/pages/SystemSettings/Questionnaire'));
const SystemSettings = React.lazy(() => import(/* webpackChunkName: 'SystemSettings' */ './js/pages/SystemSettings/SystemSettings'));
const TeamHome = React.lazy(() => import(/* webpackChunkName: 'TeamHome' */ './js/pages/TeamHome'));
const TaskGroup = React.lazy(() => import(/* webpackChunkName: 'TaskGroup' */ './js/pages/SystemSettings/TaskGroup'));
const Tasks = React.lazy(() => import(/* webpackChunkName: 'Tasks' */ './js/pages/Tasks'));
// const TeamMembers = React.lazy(() => import(/* webpackChunkName: 'TeamMembers' */ './js/pages/TeamHome'));
const Teams = React.lazy(() => import(/* webpackChunkName: 'Teams' */ './js/pages/Teams'));


function App () {
  renderLog('App');
  const [hideHeader] = useState(false);


  // Inject this once for the app, for all react-query queries
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  useEffect(() => {
    console.log('--------- initializejQuery() ---------');
    initializejQuery(() => {
      console.log('--------- jQuery has been initialized ---------');
    });
    return () => {
      // Anything in here is fired on component unmount, equiv to componentDidUnmount()
    };
  }, []);


  const isAuth = localStorage.getItem('isAuthenticated');
  console.log('======================================== isAuthenticated: "  ', isAuth, ' =============================');

  return (
    <>
      <StyledEngineProvider injectFirst>
        <QueryClientProvider client={queryClient}>
          <ConnectAppContext>
            <ThemeProvider theme={muiTheme}>
              <BrowserRouter>
                <WeVoteBody>
                  <Header hideHeader={hideHeader} params={{ }} pathname={normalizedHref()} />
                  <Drawers />
                  <Routes>
                    <Route path="/answers/:questionnaireId/:personId" element={<QuestionnaireAnswers />} />
                    <Route element={<PrivateRoute />}>
                      <Route path="/faq" element={<FAQ />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/q/:questionnaireId/:personId" element={<AnswerQuestionsForm />} />
                    <Route path="/questionnaire/:questionnaireId" element={<QuestionnaireQuestionList />} />
                    <Route path="/system-settings" element={<SystemSettings />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/task-group/:taskGroupId" element={<TaskGroup />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/team-home/:teamId" element={<TeamHome />} />
                    <Route path="/" element={<Teams />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                  {/* Hack 1/14/25 <Footer /> */}
                  <ReactQueryDevtools />
                </WeVoteBody>
              </BrowserRouter>
            </ThemeProvider>
          </ConnectAppContext>
        </QueryClientProvider>
      </StyledEngineProvider>
    </>
  );
}

const WeVoteBody = styled('div')`
  // In WebApp, we rely on many of these from the body from main.css, including:
  background-color: #fff; // rgb(235, 236, 238); // #fafafa;
  color: #000;
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;

  display: block;
  position: relative;
  z-index: 0;
  // this debug technique works!  ${() => console.log('-----------------------------')}
`;

export default App;
