import { useQuery } from "@tanstack/react-query";
import { SessionPayload } from "../lib/session";
import { api } from "@/modules/common/lib/api";

type User = SessionPayload | null;

type SessionResponse = {
  user: User;
};

const fetchUser = async (): Promise<User> => {
  const { data } = await api.get<SessionResponse>("/auth/session");

  return data.user;
};

export function useAuth() {
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ["auth", "session"],
    queryFn: fetchUser,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    user: user ?? null,
    isLoading,
    error,
    refreshUser: refetch,
  };
}
