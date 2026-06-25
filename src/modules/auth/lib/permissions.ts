import { SessionPayload } from "./session";

// Can Create or Update or Delete
export function canCUD(username: string, currentUser: SessionPayload | null) {
  if (!currentUser) return false;
  return (
    username === currentUser.username || ["OWNER"].includes(currentUser.role)
  );
}
