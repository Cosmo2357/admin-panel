//import axios from 'axios';
//import useStore from '../stores/mainStore';
//import { ContentType } from '@/models';
import { mockPaymentsData } from '@/mocks';
import useMainStore from '../stores/mainStore';

const useFetchPaymentsData = () => {
  const fetchPaymentsData = async () => {
    useMainStore.setState({ contentsLoading: true });
    try {
      // const response = await axios.get('/api/user');
      // const contentsData = response.data;

      setTimeout(() => {
        useMainStore.setState(() => ({
          payments: mockPaymentsData,
          paymentsLoading: false,
        }));
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch payments data:', error);
      useMainStore.setState({ paymentsLoading: false });
    }
  };

  return { fetchPaymentsData };
};

export default useFetchPaymentsData;
