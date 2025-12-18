import type { DiscussionMessage } from "../../validation/discussion.type";

interface Props {
  message: DiscussionMessage;
}

export default function EventDiscussionMessage({ message }: Props) {
  return (
    <li className="border rounded p-3 bg-white shadow-sm">
      <div className="text-sm text-gray-600">
        <span className="font-medium">{message.user.name}</span>{" "}
        <span>
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="mt-1">{message.content}</p>
    </li>
  );
}