import React, { useEffect } from 'react';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditQuestionDrawerMainContent from '../Questionnaire/EditQuestionDrawerMainContent';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';

const EditQuestionDrawer = () => {
  renderLog('EditQuestionDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditQuestionDrawer: Context value changed:', true);
    const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
    if (questionIdTemp >= 0) {
      setHeaderTitleJsx(<>Edit Question</>);
    } else {
      setHeaderTitleJsx(<>Add Question</>);
    }
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   const questionIdTemp = getAppContextValue('editQuestionDrawerQuestionId');
  //   if (questionIdTemp >= 0) {
  //     setHeaderTitleJsx(<>Edit Question</>);
  //   } else {
  //     setHeaderTitleJsx(<>Add Question</>);
  //   }
  // };

  // React.useEffect(() => {
  //   // const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
  //   // onAppObservableStoreChange();
  //
  //   return () => {
  //     // appStateSubscription.unsubscribe();
  //   };
  // }, []);

  return (
    <DrawerTemplateA
      drawerId="editQuestionDrawer"
      drawerOpenGlobalVariableName="editQuestionDrawerOpen"
      mainContentJsx={<EditQuestionDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditQuestionDrawer.propTypes = {
};

export default EditQuestionDrawer;
