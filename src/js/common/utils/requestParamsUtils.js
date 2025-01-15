const makeRequestParams = (fixedPreamble = '', data) => {
  let requestParams = '';
  if (fixedPreamble.length) {
    requestParams += `${fixedPreamble}&`;
  }
  Object.keys(data).forEach((key) => {
    requestParams += `${key}ToBeSaved=${data[key]}&`;
    requestParams += `${key}Changed=${true}&`;
  });
  requestParams = requestParams.slice(0, -1);
  return encodeURI(requestParams);
};

export default makeRequestParams;
