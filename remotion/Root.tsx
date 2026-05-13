import React from "react";
import { Composition } from "remotion";
import { ShortComposition } from "../components/RemotionShortPlayer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortVideo"
        component={ShortComposition}
        durationInFrames={120} // Placeholder, will be overridden by inputProps if needed
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoUrl: "",
          startTime: 0,
          endTime: 4,
          captions: "[]",
          captionStyle: {}
        }}
      />
    </>
  );
};
