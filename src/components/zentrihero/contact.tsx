// File: src/components/zentrihero/Contact.tsx
"use client";

import React from "react";
import Image from "next/image";
import AnimatedTitle from "./animatedtitle";
import Button from "./button";

interface ImageClipBoxProps {
  src: string;
  clipClass: string;
}

const ImageClipBox: React.FC<ImageClipBoxProps> = ({ src, clipClass }) => (
  <div className={`${clipClass} relative`}>
    <Image
      src={src}
      alt=""
      fill
      className="object-cover"
    />
  </div>
);

const Contact: React.FC = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-[radial-gradient(ellipse_at_bottom_left,#fae8b4,#EAEEFE_100%)] py-24 text-black sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          {/* background accent if any */}
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">Join Zentry</p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
            containerClass="text-black special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <div className="flex flex-row gap-4 mt-10">
            <Button
              id="contact-3d-btn"
              title="3D MUSEUM"
              containerClass="cursor-pointer"
              rightIcon={null}
              leftIcon={null}
            />
            <Button
              id="contact-vr-btn"
              title="VIRTUAL REALITY"
              containerClass="cursor-pointer"
              rightIcon={null}
              leftIcon={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
