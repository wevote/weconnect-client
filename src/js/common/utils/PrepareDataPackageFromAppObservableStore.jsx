// import AppObservableStore from '../../stores/AppObservableStore';

import { useConnectAppContext } from '../../contexts/ConnectAppContext';

const PrepareDataPackageFromAppObservableStore  = ({ acceptedVariables }) => {
  // Extract data from AppObservableStore and put into data object, with Changed variable, to be sent to server
  const data = {};
  const { getAppContextValue } = useConnectAppContext();  // This component will re-render whenever the value of WeAppContext changes


  for (let i = 0; i < acceptedVariables.length; i++) {
    // Ex/ emailPersonalToBeSaved and emailPersonalChanged
    // console.log(`prepareData: ${acceptedVariables[i]}ToBeSaved:`, AppObservableStore.getGlobalVariableState(`${acceptedVariables[i]}ToBeSaved`));
    if (getAppContextValue(`${acceptedVariables[i]}Changed`)) {
      // If the value has changed, add it to the data dictionary
      if (getAppContextValue(`${acceptedVariables[i]}Changed`) === true) {
        data[`${acceptedVariables[i]}Changed`] = true;
        data[`${acceptedVariables[i]}ToBeSaved`] = getAppContextValue(`${acceptedVariables[i]}ToBeSaved`);
      }
    }
  }
  return data;
};

export default PrepareDataPackageFromAppObservableStore;
