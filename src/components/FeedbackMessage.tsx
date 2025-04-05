//   Component for displaying feedback messages
import { FeedbackMessage as FeedbackMessageType } from "@/types/notes";

interface FeedbackMessageProps {
  message: FeedbackMessageType;
}

export const FeedbackMessage = ({ message }: FeedbackMessageProps) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
        message.type === "success"
          ? "bg-green-500"
          : message.type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      } text-white`}
    >
      {message.text}
    </div>
  );
};
