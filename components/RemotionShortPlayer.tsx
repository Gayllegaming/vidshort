"use client";
import { Player } from "@remotion/player";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import React, { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "../lib/utils";

export interface CaptionStyle {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  inactiveColor?: string;
  inactiveBackgroundColor?: string;
  fontFamily?: string;
  fontWeight?: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  borderRadius?: number;
  padding?: string;
  textShadow?: string;
  outlineColor?: string;
  outlineWidth?: number;
}

const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  fontSize: 140,
  color: "#000000",
  backgroundColor: "#FFFF00",
  inactiveColor: "rgba(255, 255, 255, 0.6)",
  inactiveBackgroundColor: "transparent",
  fontWeight: "900",
  textTransform: "uppercase",
  borderRadius: 15,
  padding: "15px 30px",
  textShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

export const ShortComposition = ({ 
  videoUrl, 
  startTime, 
  endTime, 
  captions,
  captionStyle = DEFAULT_CAPTION_STYLE
}: any) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  const currentTime = startTime + (frame / fps);

  let activeGroup = null;
  if (captions) {
    let parsedCaptions = captions;
    if (typeof captions === "string") {
      try {
        parsedCaptions = JSON.parse(captions);
      } catch (e) {
        parsedCaptions = [];
      }
    }

    // Group words into chunks of 3 for better readability
    const groups = [];
    for (let i = 0; i < parsedCaptions.length; i += 3) {
      const chunk = parsedCaptions.slice(i, i + 3);
      groups.push({
        words: chunk,
        start: chunk[0].start,
        end: chunk[chunk.length - 1].end
      });
    }

    activeGroup = groups.find((g: any) => currentTime >= g.start && currentTime <= g.end);
  }

  const style = { ...DEFAULT_CAPTION_STYLE, ...captionStyle };

  return (
    <AbsoluteFill className="bg-black">
      <Sequence from={0} durationInFrames={Math.ceil((endTime - startTime) * fps)}>
        <OffthreadVideo 
          src={videoUrl}
          startFrom={Math.floor(startTime * fps)}
          endAt={Math.ceil(endTime * fps)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          crossOrigin="anonymous"
        />
        {activeGroup && (
          <AbsoluteFill className="justify-center items-center px-10 pb-40">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
              {activeGroup.words.map((w: any, i: number) => {
                const isActive = currentTime >= w.start && currentTime <= w.end;
                return (
                  <span 
                    key={i}
                    className="text-center transition-all duration-75"
                    style={{
                      fontSize: isActive ? `${(style.fontSize || 140) * 1.2}px` : `${style.fontSize}px`,
                      lineHeight: "1",
                      fontFamily: style.fontFamily || "inherit",
                      fontWeight: style.fontWeight,
                      textTransform: style.textTransform,
                      color: isActive ? style.color : style.inactiveColor,
                      backgroundColor: isActive ? style.backgroundColor : style.inactiveBackgroundColor,
                      padding: style.padding,
                      borderRadius: `${style.borderRadius}px`,
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      opacity: isActive ? 1 : 0.6,
                      boxShadow: isActive ? (style.textShadow || "0 20px 40px rgba(0,0,0,0.4)") : "none",
                      zIndex: isActive ? 10 : 1,
                      border: !isActive && style.inactiveBackgroundColor === 'transparent' ? 'none' : 'inherit'
                    }}
                  >
                    {w.punctuated_word || w.word}
                  </span>
                );
              })}
            </div>
          </AbsoluteFill>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};

export default function RemotionShortPlayer({ videoUrl, short, captionStyle, className }: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const durationInSeconds = short.endTime - short.startTime;
  const fps = 30;
  const durationInFrames = Math.ceil(durationInSeconds * fps);

  // Parse captionStyle if it's a string from DB
  let parsedCaptionStyle = captionStyle;
  if (typeof captionStyle === "string") {
    try {
      parsedCaptionStyle = JSON.parse(captionStyle);
    } catch (e) {
      parsedCaptionStyle = {};
    }
  }

  if (!isPlaying) {
    return (
      <div 
        className={cn(
          "relative w-full aspect-[9/16] bg-[#111] rounded-2xl border border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-all shadow-2xl",
          className
        )}
        onClick={() => setIsPlaying(true)}
      >
        {/* Thumbnail Preview using a static frame of the video */}
        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
           <video 
             src={`${videoUrl}#t=${short.startTime}`} 
             className="w-full h-full object-cover"
             muted
             playsInline
           />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/30 group-hover:scale-110 group-hover:bg-primary/40 transition-all duration-500">
            <Play className="w-10 h-10 text-primary fill-primary" />
          </div>
          <div className="text-center">
            <p className="text-white font-black text-xl tracking-tight mb-1 uppercase">Click to Play</p>
            <p className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">{durationInSeconds.toFixed(1)}s Short</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-primary/50 w-1/3 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-[0_0_80px_rgba(0,0,0,0.5)]", className)}>
      <Player
        component={ShortComposition}
        inputProps={{
          videoUrl,
          startTime: short.startTime,
          endTime: short.endTime,
          captions: short.captions,
          captionStyle: parsedCaptionStyle || (short.captionStyle ? (typeof short.captionStyle === 'string' ? JSON.parse(short.captionStyle) : short.captionStyle) : null)
        }}
        durationInFrames={durationInFrames}
        compositionWidth={1080}
        compositionHeight={1920}
        fps={fps}
        style={{
          width: "100%",
          height: "100%",
        }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}


