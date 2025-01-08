import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import webAppConfig from '../config';

export const weConnectQueryFn = async (queryKey, params) => {
  const url = new URL(`${queryKey}/`, webAppConfig.STAFF_API_SERVER_API_ROOT_URL);
  url.search = new URLSearchParams(params);
  console.log('weConnectQueryFn url.href: ', url.href);

  const response = await axios.get(url.href);
  // console.log('weConnectQueryFn  response.data: ', JSON.stringify(response.data));

  return response.data;
};

const useFetchData = (queryKey, fetchParams) => {
  const { data, isSuccess } = useQuery({
    queryKey,
    queryFn: () => weConnectQueryFn(queryKey, fetchParams),
  });
  return { data, isSuccess };
};

export default useFetchData;

