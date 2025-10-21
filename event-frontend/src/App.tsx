import Register from './components/Register';
import Login from './components/Login';
import AddEvent from './components/AddEvent';
import EventList from './components/EventList';
import EventsLayout from './components/EventsLayout';
import Event from './components/Event';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";



const App = () => {
 const { user, login } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onLogin={login}/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
          ) :(
            <>
              <Route path="/events" element={<EventsLayout />}>
                <Route index element={<EventList />} />
                <Route path="new" element={<AddEvent />} />
                <Route path=":id" element={<Event />} />
              </Route>
              <Route path="*" element={<Navigate to="/events" replace />} />
            </>
          )}
      </Routes>
    </BrowserRouter>
   
  );
};

export default App;
