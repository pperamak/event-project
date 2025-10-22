import { useAuth } from "../hooks/useAuth";
//import { useNavigate } from "react-router";

const LogOutButton = () => {
  //const navigate =useNavigate();

  const { logout } = useAuth();
  /*
  const clickFunc = () => {
    logout();
    navigate("/login");
  };
  */

  return (
    <button onClick={logout}>Log out</button>
  );
};

export default LogOutButton;