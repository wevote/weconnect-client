import React, { useEffect } from 'react';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditQuestionnaireDrawerMainContent from '../Questionnaire/EditQuestionnaireDrawerMainContent';


const EditQuestionnaireDrawer = () => {
  renderLog('EditQuestionnaireDrawer');
  const { getAppContextValue } = useConnectAppContext();

  const [headerTitleJsx, setHeaderTitleJsx] = React.useState(<></>);
  const [headerFixedJsx] = React.useState(<></>);


  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    if (getAppContextValue('editQuestionnaireDrawerOpen')) {
      console.log('EditQuestionnaireDrawer: Context value changed:', true);
      const questionnaire = getAppContextValue('selectedQuestionnaire');
      if (questionnaire) {
        setHeaderTitleJsx(<>Edit Questionnaire</>);
      } else {
        setHeaderTitleJsx(<>Add Questionnaire</>);
      }
    }
  }, [getAppContextValue]);

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
