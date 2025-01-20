import React, { useEffect, useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditQuestionDrawerMainContent from '../Questionnaire/EditQuestionDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';

const EditQuestionDrawer = () => {
  renderLog('EditQuestionDrawer');
  const { getAppContextValue } = useConnectAppContext();

  const [headerTitleJsx, setHeaderTitleJsx] = useState(<></>);
  const [headerFixedJsx] = useState(<></>);

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('EditQuestionDrawer: Context value changed:', true);
    const question = getAppContextValue('selectedQuestion');
    if (question && question.id >= 0) {
      setHeaderTitleJsx(<>Edit Question</>);
    } else {
      setHeaderTitleJsx(<>Add Question</>);
    }
  }, [getAppContextValue]);

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
