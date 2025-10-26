import { Id } from "../../convex/_generated/dataModel";

export interface Note {
  _id: Id<"notes">;
  _creationTime: number;
  title: string;
  content: string;
  userId: Id<"users">;
}
