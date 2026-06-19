import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BASE_URL } from "./api";

/**
 * useAdminGames
 * Fetches active games from backend and listens for real-time
 * adds/deletes via WebSocket. Falls back to staticGames if offline.
 */
export function useAdminGames(staticGames) {
  const [games, setGames] = useState(staticGames);
  const clientRef = useRef(null);

  useEffect(() => {
    // 1. Load games from backend
    fetch(`${BASE_URL}/api/games`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const srcSet = new Set(data.map(g => g.src));
          const backendGames = data.map(mapGame);
          const staticOnly  = staticGames.filter(g => !srcSet.has(g.src));
          setGames([...backendGames, ...staticOnly]);
        }
      })
      .catch(() => console.warn("Backend offline — using static game list"));

    // 2. WebSocket live updates
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        // Admin added/updated a game → push into UI instantly
        client.subscribe("/topic/games", msg => {
          const game = JSON.parse(msg.body);
          setGames(prev => {
            const exists = prev.find(g => g.id === game.id);
            return exists
              ? prev.map(g => g.id === game.id ? mapGame(game) : g)
              : [mapGame(game), ...prev];
          });
        });

        // Admin deleted a game → remove from UI instantly
        client.subscribe("/topic/games/delete", msg => {
          const deletedId = Number(msg.body);
          setGames(prev => prev.filter(g => g.id !== deletedId));
        });
      },
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, []);

  return games;
}

// Backend game → frontend game shape
function mapGame(g) {
  return {
    id:    g.id,
    name:  g.name,
    src:   g.src,
    mood:  g.mood,
    tags:  g.tags ? g.tags.split(",").map(t => t.trim()) : [],
    active: g.active,
  };
}


/**
 * useSessionSaver — stable callback (useCallback), not recreated on every render.
 * Saves emotion scan result to MySQL via POST /api/sessions.
 */
export function useSessionSaver() {
  return useCallback(async ({ emotion, expressionsJson, sessionKey }) => {
    try {
      await fetch(`${BASE_URL}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, expressionsJson, sessionKey }),
      });
    } catch {
      console.warn("Session save failed — backend may be offline");
    }
  }, []); // no deps — BASE_URL is a module constant
}

/**
 * useFeedbackSaver — stable callback, saves feedback to /api/feedback.
 */
export function useFeedbackSaver() {
  return useCallback(async (payload) => {
    try {
      await fetch(`${BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      console.warn("Feedback save failed — backend may be offline");
    }
  }, []);
}