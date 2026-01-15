import User from './user.js';
import Event from './event.js';
import DiscussionMessage from './discussionMessage.js';
import MessageReaction from './messageReaction.js';

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

User.hasMany(DiscussionMessage, { foreignKey: "userId" });
DiscussionMessage.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(DiscussionMessage, { foreignKey: "eventId" });
DiscussionMessage.belongsTo(Event, { foreignKey: "eventId" });

DiscussionMessage.hasMany(MessageReaction, {
  foreignKey: "messageId",
  onDelete: "CASCADE",
});

MessageReaction.belongsTo(DiscussionMessage, {
  foreignKey: "messageId",
});

User.hasMany(MessageReaction, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

MessageReaction.belongsTo(User, {
  foreignKey: "userId",
});

export { User, Event, DiscussionMessage, MessageReaction};

