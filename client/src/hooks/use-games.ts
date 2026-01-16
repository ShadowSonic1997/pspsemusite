import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GameInput } from "@shared/routes";

export function useGames() {
  return useQuery({
    queryKey: [api.games.list.path],
    queryFn: async () => {
      const res = await fetch(api.games.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch games');
      return api.games.list.responses[200].parse(await res.json());
    },
  });
}

export function useGame(id: number) {
  return useQuery({
    queryKey: [api.games.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.games.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch game');
      return api.games.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GameInput) => {
      const validated = api.games.create.input.parse(data);
      const res = await fetch(api.games.create.path, {
        method: api.games.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.games.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create game');
      }
      return api.games.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.games.list.path] }),
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.games.delete.path, { id });
      const res = await fetch(url, { 
        method: api.games.delete.method, 
        credentials: "include" 
      });
      if (!res.ok) throw new Error('Failed to delete game');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.games.list.path] }),
  });
}
