//import axios from 'axios';
//import useStore from '../stores/mainStore';
//import { ContentType } from '@/models';
import { mockUsersData } from '@/mocks';
import useMainStore from '../stores/mainStore';

const useFetchUsersData = () => {
  console.log('useFetchUsersData');
  const fetchUsersData = async () => {
    useMainStore.setState({ usersLoading: true });
    try {
      // const response = await axios.get('/api/user');
      // const contentsData = response.data;

      setTimeout(() => {
        useMainStore.setState(() => ({
          users: mockUsersData,
          usersLoading: false,
        }));
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      useMainStore.setState({ usersLoading: false });
    }
  };

  return { fetchUsersData };
};

export default useFetchUsersData;
