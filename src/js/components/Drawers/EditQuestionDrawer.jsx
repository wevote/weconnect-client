import React from 'react';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditQuestionDrawerMainContent from '../Questionnaire/EditQuestionDrawerMainContent';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


const EditQuestionDrawer = () => {
  renderLog('EditQuestionDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);

  const onAppObservableStoreChange = () => {
    const questionIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionId');
    if (questionIdTemp >= 0) {
      setHeaderTitleJsx(<>Edit Question</>);
    } else {
      setHeaderTitleJsx(<>Add Question</>);
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
    };
  }, []);

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
