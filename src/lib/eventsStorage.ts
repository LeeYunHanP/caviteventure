// A simple in-memory array of events for DEMO ONLY
// In real code, store in a DB.
export interface EventData {
    id: number;
    image: string;
    title: string;
    date: string;
    location: string;
    status: "pending" | "approved";
  }
  
  export const events: EventData[] = [];
  