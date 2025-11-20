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
    <button onClick={logout} className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-800">Log out</button>
  );
};

export default LogOutButton;