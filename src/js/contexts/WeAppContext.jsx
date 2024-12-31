import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
// import { messageService } from '../stores/AppObservableStore';

// Replaces AppObservableStore.js
// Create the context
const WeAppContext = createContext({});

// Create the provider component
// eslint-disable-next-line no-unused-vars
export const WeAppContextProvider = ({ children }) => {
  // console.log('initialization of WeAppContextProvider ===============');
  const [data, setData] = useState({});

  const setAppContextValue = (key, value) => {
    setData((prevStore) => ({ ...prevStore, [key]: value }));
  };

  const getAppContextData = () => data;

  const getAppContextValue = (key) => data[key];

  const setAppContextValuesInBulk = (variableDict) => {
    const keysIn = Object.keys(variableDict);
    const values = Object.values(variableDict);
    for (let i = 0; i < keysIn.length; i++) {
      setData((prevStore) => ({ ...prevStore, [keysIn[i]]: values[i] }));
    }
  };

  return (
    <WeAppContext.Provider value={{ getAppContextData, setAppContextValue, getAppContextValue, setAppContextValuesInBulk }}>
      {children}
    </WeAppContext.Provider>
  );
};
WeAppContextProvider.propTypes = {
  children: PropTypes.object,
};

export default WeAppContextProvider;
export function useWeAppContext () {
  return useContext(WeAppContext);
}









// Replaces AppObservableStore.js
// export const WeAppContext = createContext({ value: undefined, loadValue: () => console.log('Default function') });
//
//
// // https://stackoverflow.com/questions/57819211/how-to-set-a-value-with-usecontext
// // eslint-disable-next-line react/prop-types
// export const WeProvider = ({ children }) => {
//   const [value, setAppContextValue] = useState(undefined);
//
//   return (
//     <WeAppContext.Provider
//       value={{
//         value,
//         loadAppContextValue: (currentValue) => {
//           setAppContextValue(currentValue);
//         },
//       }}
//     >
//       {children}
//     </WeAppContext.Provider>
//   );
// };
//
