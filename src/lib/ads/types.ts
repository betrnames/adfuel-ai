import type { BrandLook } from "./brand";
import type { Engine, Goal, Platform } from "./plans";
import type { LaunchFields } from "./launch";

export type { BrandLook };

export type Angle = {
  name: string;
  hook: string;
  why: string;
};

export type Octane = {
  score: number;
  rationale: string;
  lifts: string[];
};

export type Targeting = {
  audiences: string[];
  placements: string[];
};

export type VideoScript = {
  length: string;
  hook: string;
  body: string;
  cta: string;
  overlayText: string;
};

export type AdImage = {
  url: string;
  aspect: string;
  prompt: string;
};

export type AdPackContent = {
  productName: string;
  headlines: string[];
  primaryTexts: string[];
  descriptions: string[];
  ctas: string[];
  angles: Angle[];
  octane: Octane;
  targeting: Targeting | null;
  videoScripts: VideoScript[] | null;
  imagePrompt: string;
  images: AdImage[];
  launch?: LaunchFields | null;
  brand?: BrandLook | null;
  writer?: "hosted" | "byok" | "draft";
};

export type AdPackRecord = {
  id: number;
  shareId: string | null;
  productName: string;
  brief: string;
  platform: Platform;
  goal: Goal;
  engine: Engine;
  octane: number | null;
  pack: AdPackContent;
  createdAt: string;
};

export type Profile = {
  userId: string;
  plan: string;
  credits: number;
  createdAt: string;
};

export type GenerateInput = {
  prompt: string;
  platform: Platform;
};

export type GenerateSuccess = {
  ok: true;
  pack: AdPackRecord | null;
  profile: Profile;
  writer: "hosted" | "byok" | "draft";
  writerLabel: string;
};
