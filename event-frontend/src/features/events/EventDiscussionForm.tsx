import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_MESSAGE } from "../../graphql/mutations";
import { GET_EVENT_MESSAGES } from "../../graphql/queries";

interface Props {
  eventId: string;
}

export default function EventDiscussionForm({ eventId }: Props) {
  const [content, setContent] = useState("");

  const [addMessage, { loading, error }] = useMutation(ADD_MESSAGE, {
    refetchQueries: [
      {
        query: GET_EVENT_MESSAGES,
        variables: { eventId },
      },
    ],
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addMessage({
      variables: {
        eventId,
        content,
      },
    });

    setContent("");
  };

  return (
    <form onSubmit={submit} className="mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded p-2"
        placeholder="Write a message…"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        {loading ? "Posting…" : "Post message"}
      </button>

      {error && <p className="text-red-600 mt-1">Failed to post</p>}
    </form>
  );
}