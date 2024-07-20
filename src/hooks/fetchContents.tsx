//import axios from 'axios';
//import useStore from '../stores/mainStore';
//import { ContentType } from '@/models';
import { mockContentsData } from '@/mocks';
import useMainStore from '../stores/mainStore';

const useFetchContentsData = () => {
  const fetchContentsData = async () => {
    useMainStore.setState({ contentsLoading: true });
    try {
      // const response = await axios.get('/api/user');
      // const contentsData = response.data;

      setTimeout(() => {
        useMainStore.setState(() => ({
          contents: mockContentsData,
          contentsLoading: false,
        }));
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      useMainStore.setState({ contentsLoading: false });
    }
  };

  return { fetchContentsData };
};

export default useFetchContentsData;
