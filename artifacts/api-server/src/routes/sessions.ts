import { Router, type IRouter } from "express";
import { db, sessionsTable } from "@workspace/db";
import { CreateSessionBody, ListSessionsResponse } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/sessions", async (req, res) => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;

  const [session] = await db.insert(sessionsTable).values({
    stripLayout: data.stripLayout,
    filter: data.filter,
    frame: data.frame,
    overlayText: data.overlayText,
    hasSparkles: data.hasSparkles,
    dailyTheme: data.dailyTheme,
  }).returning();

  res.status(201).json({
    id: String(session.id),
    createdAt: session.createdAt.toISOString(),
    stripLayout: session.stripLayout,
    filter: session.filter ?? undefined,
    frame: session.frame ?? undefined,
    overlayText: session.overlayText ?? undefined,
    hasSparkles: session.hasSparkles ?? undefined,
    dailyTheme: session.dailyTheme ?? undefined,
  });
});

router.get("/sessions", async (_req, res) => {
  const sessions = await db.select().from(sessionsTable).orderBy(desc(sessionsTable.createdAt)).limit(20);

  const data = ListSessionsResponse.parse(
    sessions.map((s) => ({
      id: String(s.id),
      createdAt: s.createdAt.toISOString(),
      stripLayout: s.stripLayout,
      filter: s.filter ?? undefined,
      frame: s.frame ?? undefined,
      overlayText: s.overlayText ?? undefined,
      hasSparkles: s.hasSparkles ?? undefined,
      dailyTheme: s.dailyTheme ?? undefined,
    }))
  );

  res.json(data);
});

export default router;
