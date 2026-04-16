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
        className={message.myReaction === "UP" ? "active" : ""}
      >
        👍 {message.upvotes}
      </button>

      <button
        onClick={() => handleReact("DOWN")}
        className={message.myReaction === "DOWN" ? "active" : ""}
      >
        👎 {message.downvotes}
      </button>
    </div>
  );
};