import React from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditQuestionnaireDrawerMainContent from '../Questionnaire/EditQuestionnaireDrawerMainContent';


const EditQuestionnaireDrawer = () => {
  renderLog('EditQuestionnaireDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);

  const onAppObservableStoreChange = () => {
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionnaireDrawerQuestionnaireId');
    if (questionnaireIdTemp >= 0) {
      setHeaderTitleJsx(<>Edit Questionnaire</>);
    } else {
      setHeaderTitleJsx(<>Add Questionnaire</>);
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
      drawerId="editQuestionnaireDrawer"
      drawerOpenGlobalVariableName="editQuestionnaireDrawerOpen"
      mainContentJsx={<EditQuestionnaireDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditQuestionnaireDrawer.propTypes = {
};

export default EditQuestionnaireDrawer;
