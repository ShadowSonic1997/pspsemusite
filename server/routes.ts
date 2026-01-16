import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingGames = await storage.getGames();
  if (existingGames.length === 0) {
    // Seed with Cave Story (PSP Homebrew)
    await storage.createGame({
      title: "Cave Story (Homebrew)",
      url: "https://archive.org/download/cave-00992-00000/cavestory.zip", // Direct download link
      platform: "psp",
      description: "A classic metroidvania style game ported to PSP."
    });
    
    // Seed with another placeholder to show the list
    await storage.createGame({
      title: "Add your own game",
      url: "",
      platform: "psp",
      description: "Paste a URL to an ISO, CSO, or PBP file to play."
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup
  await seedDatabase();

  app.get(api.games.list.path, async (req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.get(api.games.get.path, async (req, res) => {
    const game = await storage.getGame(Number(req.params.id));
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  });

  app.post(api.games.create.path, async (req, res) => {
    try {
      const input = api.games.create.input.parse(req.body);
      const game = await storage.createGame(input);
      res.status(201).json(game);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.games.delete.path, async (req, res) => {
    await storage.deleteGame(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
