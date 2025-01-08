import React, { useEffect } from 'react';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditQuestionnaireDrawerMainContent from '../Questionnaire/EditQuestionnaireDrawerMainContent';


const EditQuestionnaireDrawer = () => {
  renderLog('EditQuestionnaireDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [headerFixedJsx, setHeaderFixedJsx] = React.useState(<></>);
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of ConnectAppContext changes


  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    if (getAppContextValue('editQuestionnaireDrawerOpen')) {
      console.log('EditQuestionnaireDrawer: Context value changed:', true);
      const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
      if (questionnaireIdTemp >= 0) {
        setHeaderTitleJsx(<>Edit Questionnaire</>);
      } else {
        setHeaderTitleJsx(<>Add Questionnaire</>);
      }
    }
  }, [getAppContextValue]);

  // const onAppObservableStoreChange = () => {
  //   const questionnaireIdTemp = getAppContextValue('editQuestionnaireDrawerQuestionnaireId');
  //   if (questionnaireIdTemp >= 0) {
  //     setHeaderTitleJsx(<>Edit Questionnaire</>);
  //   } else {
  //     setHeaderTitleJsx(<>Add Questionnaire</>);
  //   }
  // };

  // React.useEffect(() => {
  //   const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
  //   onAppObservableStoreChange();
  //
  //   return () => {
  //     appStateSubscription.unsubscribe();
  //   };
  // }, []);

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
