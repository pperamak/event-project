import { Outlet, Link } from "react-router";

export default function EventsLayout() {
  return (
    <div>
      <nav className="p-4 flex gap-4 border-b">
        <Link to="/events">All Events</Link>
        <Link to="/events/new">Create Event</Link>
      </nav>
      <main className="p-4">
        <Outlet /> 
      </main>
    </div>
  );
}