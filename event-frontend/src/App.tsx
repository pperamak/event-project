import Register from './components/Register';
import Login from './components/Login';
import AddEvent from './components/AddEvent';
import EventList from './components/EventList';
import EventsLayout from './components/EventsLayout';
import Event from './components/Event';
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
