import { renderVideoOnLambda, getRenderProgress } from "@remotion/lambda/client";

export const REMOTION_CONFIG = {
  REGION: (process.env.AWS_REGION as any) || "eu-north-1",
  FUNCTION_NAME: process.env.REMOTION_FUNCTION_NAME || "remotion-render-4-0-458-mem2048mb-disk2048mb-240sec",
  BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "vidshortbucket",
  SERVE_URL: process.env.REMOTION_SERVE_URL || "https://remotionlambda-eunorth1-hbc0b4z17u.s3.eu-north-1.amazonaws.com/sites/vidshort-site/index.html",
  COMPOSITION_ID: "ShortVideo",
  FPS: 30,
};

export { renderVideoOnLambda, getRenderProgress };
