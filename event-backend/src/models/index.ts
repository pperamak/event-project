import User from './user.js';
import Event from './event.js';
import DiscussionMessage from './discussionMessage.js';

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

User.hasMany(DiscussionMessage, { foreignKey: "userId" });
DiscussionMessage.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(DiscussionMessage, { foreignKey: "eventId" });
DiscussionMessage.belongsTo(Event, { foreignKey: "eventId" });

export { User, Event, DiscussionMessage};

