//import { gql, useQuery } from '@apollo/client';
import Register from './components/Register';
import Login from './components/Login';
import AddEvent from './components/AddEvent';

/*
const ALL_USERS = gql`
  query{
    allUsers {
      name
      email
      id
    }
  }
`;
*/

const App = () => {
  /*
  const result = useQuery(ALL_USERS);
  if (result.loading) {
    return <div>loading...</div>;
  }
  console.log(result.data.allUsers);
  */
  return (
  <div>
    <h1>Something Big Is About to Happen Soon!</h1>
    <Register/>
    <Login/>
    <AddEvent/>     
  </div>
  );
};

export default App;
