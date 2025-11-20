import { Outlet, Link } from "react-router";
import LogOutButton from "./LogOutButton";

export default function EventsLayout() {
  return (
    <div>
      <nav className="p-4 flex gap-4 border-red-400 bg-red-300 justify-center">
        <Link to="/events" className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600">All Events</Link>
        <Link to="/events/new" className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600">Create Event</Link>
        <LogOutButton/>
      </nav>
      
      <main className="p-4">
        <Outlet /> 
      </main>
    </div>
  );
}