import type { DiscussionMessage } from "../../validation/discussion.type";
import { useMutation } from "@apollo/client";
import { REACT_TO_MESSAGE } from "../../graphql/mutations";

type Props = {
  message: DiscussionMessage;
};

export const ReactionButtons = ({ message }: Props) => {
  const [react] = useMutation(REACT_TO_MESSAGE);

  const handleReact = async (type: "UP" | "DOWN") => {
   await react({
      variables: {
        messageId: message.id,
        type,
      },
    });
    console.log(type);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleReact("UP")}
        className={`px-2 py-1 rounded ${
    message.myReaction === "UP"
      ? "bg-red-500 text-white"
      : "bg-gray-200 text-gray-700"
  }`}
      >
        👍 {message.upvotes}
      </button>

      <button
        onClick={() => handleReact("DOWN")}
        className={`px-2 py-1 rounded ${
    message.myReaction === "DOWN"
      ? "bg-red-500 text-white"
      : "bg-gray-200 text-gray-700"
  }`}
      >
        👎 {message.downvotes}
      </button>
    </div>
  );
};