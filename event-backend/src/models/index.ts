import User from './user.js';
import Event from './event.js';

User.hasMany(Event);
Event.belongsTo(User);

export { User, Event};

