import Register from './features/auth/Register';
import Login from './features/auth/Login';
import AddEvent from './features/events/AddEvent';
import EventList from './features/events/EventList';
import EventsLayout from './features/events/EventsLayout';
import Event from './features/events/Event';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

 
const App = () => {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />  
        </Route>           
        <Route element={<ProtectedRoute/>}>
          <Route path="/events" element={<EventsLayout />}>
            <Route index element={<EventList />} />
            <Route path="new" element={<AddEvent />} />
            <Route path=":id" element={<Event />} />
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Route>         
        </Route>                         
        <Route path="*" element={<Navigate to="/login" replace />} /> 
      </Routes>
    </BrowserRouter>
   
  );
};

export default App;
