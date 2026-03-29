import { Router, type IRouter } from "express";
import { GetDailyThemeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const DAILY_THEMES = [
  { title: "Red Day", description: "Fill your frame with as many red things as you can!", emoji: "🔴", colorHint: "#ef4444" },
  { title: "Silly Face Friday", description: "Make your silliest face for every photo!", emoji: "🤪", colorHint: "#f59e0b" },
  { title: "Nature Vibes", description: "Take your photobooth outside or with plants/flowers!", emoji: "🌿", colorHint: "#22c55e" },
  { title: "Bestie Day", description: "Grab your bestie and take a strip together!", emoji: "👯", colorHint: "#ec4899" },
  { title: "Hat Party", description: "Wear the most ridiculous hat you can find!", emoji: "🎩", colorHint: "#8b5cf6" },
  { title: "Monochrome Moment", description: "Dress fully in one color for your strip!", emoji: "🖤", colorHint: "#1f2937" },
  { title: "Sunlit Golden Hour", description: "Find the best natural light and glow up!", emoji: "✨", colorHint: "#f59e0b" },
  { title: "Retro Feels", description: "Strike a vintage pose like it's the 90s!", emoji: "📼", colorHint: "#d97706" },
  { title: "Blue Mood", description: "Channel your inner calm with blue tones all around!", emoji: "💙", colorHint: "#3b82f6" },
  { title: "Flower Power", description: "Use real or fake flowers as props!", emoji: "🌸", colorHint: "#f472b6" },
  { title: "Dark & Mysterious", description: "Low light, dramatic poses, main character energy.", emoji: "🌙", colorHint: "#4c1d95" },
  { title: "Sparkle Queen Day", description: "Add every glitter and sparkle effect available!", emoji: "💖", colorHint: "#ec4899" },
  { title: "Rainbow Chaos", description: "Put every color in frame — the more chaotic the better!", emoji: "🌈", colorHint: "#6366f1" },
  { title: "Pet Paparazzi", description: "Feature your pet (or a stuffed animal) as the star!", emoji: "🐾", colorHint: "#84cc16" },
  { title: "Cozy Corner", description: "Take your strip wrapped in blankets and pillows!", emoji: "🛋️", colorHint: "#a16207" },
  { title: "Y2K Throwback", description: "Bust out your most Y2K accessories and poses!", emoji: "💿", colorHint: "#c026d3" },
  { title: "Mirror Mirror", description: "Use a mirror as a prop or background for reflection magic!", emoji: "🪞", colorHint: "#94a3b8" },
  { title: "Food Photobooth", description: "Hold your fave snack or drink in every shot!", emoji: "🍓", colorHint: "#dc2626" },
  { title: "Summer Glow", description: "Sunshine, shades, and summertime vibes only!", emoji: "☀️", colorHint: "#fbbf24" },
  { title: "Birthday Energy", description: "Celebrate like it's your birthday even if it isn't!", emoji: "🎉", colorHint: "#f97316" },
  { title: "Aesthetic Minimalist", description: "One prop, clean background, let your face do the talking.", emoji: "🤍", colorHint: "#f8fafc" },
  { title: "Art Museum Pose", description: "Pose like a famous painting or sculpture!", emoji: "🎨", colorHint: "#78350f" },
  { title: "Cozy Autumn Day", description: "Warm tones, leaves, and PSL vibes.", emoji: "🍂", colorHint: "#b45309" },
  { title: "Winter Wonderland", description: "Bundle up and bring snowy or icy props!", emoji: "❄️", colorHint: "#bae6fd" },
  { title: "Spring Bloom", description: "Fresh flowers, pastels, and new beginnings!", emoji: "🌷", colorHint: "#f9a8d4" },
  { title: "Galaxy Brain", description: "Go cosmic — stars, planets, space vibes!", emoji: "🌌", colorHint: "#1e1b4b" },
  { title: "Movie Night", description: "Grab popcorn, throw on something comfy!", emoji: "🎬", colorHint: "#292524" },
  { title: "Disco Fever", description: "Shimmer, shine, and dance!", emoji: "🪩", colorHint: "#a855f7" },
  { title: "Cottagecore Cutie", description: "Soft, floral, dreamy countryside aesthetic.", emoji: "🍄", colorHint: "#86efac" },
  { title: "Neon Nights", description: "Glow in the dark energy — neon colors only!", emoji: "🌃", colorHint: "#06b6d4" },
  { title: "Ocean Dream", description: "Blue, teal, sea shells, beach towels — ocean vibes!", emoji: "🌊", colorHint: "#0ea5e9" },
];

function getDailyTheme(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const idx = dayOfYear % DAILY_THEMES.length;
  return DAILY_THEMES[idx];
}

router.get("/themes/daily", (_req, res) => {
  const today = new Date();
  const theme = getDailyTheme(today);
  const dateStr = today.toISOString().split("T")[0];

  const data = GetDailyThemeResponse.parse({
    id: `theme-${dateStr}`,
    date: dateStr,
    title: theme.title,
    description: theme.description,
    emoji: theme.emoji,
    colorHint: theme.colorHint,
  });

  res.json(data);
});

export default router;
