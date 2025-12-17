import User from './user.js';
import Event from './event.js';
import DiscussionMessage from './discussionMessage.js';

User.hasMany(Event);
Event.belongsTo(User);
DiscussionMessage.belongsTo(Event);
DiscussionMessage.belongsTo(User);

export { User, Event, DiscussionMessage};

