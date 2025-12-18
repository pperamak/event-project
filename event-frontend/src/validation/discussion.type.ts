export interface DiscussionMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}