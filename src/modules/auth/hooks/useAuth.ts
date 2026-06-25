import useSWRImmutable from "swr/immutable";
import axios from "axios";
import { SessionPayload } from "../lib/session";

type User = SessionPayload | null;

type SessionResponse = {
  user: User;
};

const fetcher = async (url: string): Promise<User> => {
  const { data } = await axios.get<SessionResponse>(url);
  return data.user;
};

export function useAuth() {
  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWRImmutable<User>("/api/auth/session", fetcher);

  return {
    user: user ?? null,
    loading: isLoading,
    error,
    refreshUser: mutate,
  };
}
