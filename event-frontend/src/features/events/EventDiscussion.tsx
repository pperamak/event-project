import { useQuery } from "@apollo/client";
import { GET_EVENT_MESSAGES } from "../../graphql/queries";
import type { DiscussionMessage } from "../../validation/discussion.type";

import EventDiscussionForm from "./EventDiscussionForm";
import EventDiscussionMessage from "./EventDiscussionMessage";

interface Props {
  eventId: string;
}

interface GetMessages {
  eventMessages : DiscussionMessage[]
}

export default function EventDiscussion({ eventId }: Props) {
  const { data, loading, error } = useQuery<GetMessages>(GET_EVENT_MESSAGES, {
    variables: { eventId },
  });

  if (loading) return <p>Loading discussion…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.eventMessages) return <p>No discussion found</p>;

  const messages: DiscussionMessage[] = data.eventMessages;

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Discussion</h2>
    
      <ul className="space-y-3 mt-4">
        {messages.map((msg) => (
          <EventDiscussionMessage key={msg.id} message={msg} />
        ))}
      </ul>

     <EventDiscussionForm eventId={eventId} /> 
    </section>
  );
}