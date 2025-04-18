// A simple in-memory array of events for DEMO ONLY
// In real code, store in a DB.
export interface EventData {
  id: number;
  image: string;
  title: string;
  description: string;    // Added description field
  date: string;
  time: string;           // Added time field
  location: string;
  status: "pending" | "approved";
}

export const events: EventData[] = [];