// File: src/components/zentrihero/zentrihero.tsx
"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./button";
import VideoPreview from "./videopreview";

gsap.registerPlugin(ScrollTrigger);

const totalVideos = 4;

const Hero: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const nextVdRef = useRef<HTMLVideoElement>(null);

  // count loaded videos, hide loader when all but one are ready
  const handleVideoLoad = () => {
    setLoadedVideos((c) => c + 1);
  };

  useEffect(() => {
    if (loadedVideos >= totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((i) => (i % totalVideos) + 1);
  };

  // click‑to‑expand animations
  useEffect(() => {
    if (!hasClicked) return;
    const ctx = gsap.context(() => {
      gsap.set("#next-video", { visibility: "visible" });
      gsap.to("#next-video", {
        transformOrigin: "center center",
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => void nextVdRef.current?.play(),
      });
      gsap.from("#current-video", {
        transformOrigin: "center center",
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
      });
    });
    return () => ctx.revert();
  }, [hasClicked, currentIndex]);

  // scroll‑driven clipPath animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      });
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const getVideoSrc = (i: number) =>
    `videos/hero-${i}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* loader */}
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* framed section */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        {/* preview trigger */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <VideoPreview>
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100 pointer-events-auto"
            >
              <video
                ref={nextVdRef}
                src={getVideoSrc((currentIndex % totalVideos) + 1)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </VideoPreview>
        </div>

        {/* next expanded video */}
        <video
          ref={nextVdRef}
          src={getVideoSrc(currentIndex)}
          loop
          muted
          id="next-video"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible z-20 size-64 object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        {/* background loop */}
        <video
          src={getVideoSrc(
            currentIndex === totalVideos ? 1 : currentIndex + 1
          )}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={handleVideoLoad}
        />

        {/* overlay text */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          EX<b>PLO</b>RING
        </h1>
        <div className="absolute inset-0 z-40 flex flex-col justify-center px-5 sm:px-10 pointer-events-none">
          <h2 className="special-font hero-heading text-blue-100 mb-4">
            redefi<b>n</b>e
          </h2>
          <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
            Enter the Museum Layer <br /> Unleash the Exploration
          </p>
          <div className="pointer-events-auto">
            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              rightIcon={null}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
