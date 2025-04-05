//   Interface for our note type
export interface Note {
  id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

//   Types for feedback messages
export type MessageType = "success" | "error" | "info";
export interface FeedbackMessage {
  type: MessageType;
  text: string;
}

//   Constants
export const MAX_NOTE_LENGTH = 10000; //   Maximum characters per note
