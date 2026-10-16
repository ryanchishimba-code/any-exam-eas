"use client";

import { useEffect, useState } from "react";
import { IconPlay } from "@/components/marketing/elevation/home-icons";
import {
  HOW_TO_PASS_MEDIA,
  HOW_TO_PASS_TITLE,
  buildShareLinks,
} from "@/lib/marketing/home-video";

type Heading = "h1" | "h2";

export function HomePassVideo({
  shareUrl,
  heading,
  anchored = false,
}: {
  shareUrl: string;
  heading: Heading;
  anchored?: boolean;
}) {
  const Title = heading;

  return (
    <section
      id={anchored ? "video" : "home-pass-video"}
      className="home-section home-video-section home-rise"
      aria-labelledby="pass-video-heading"
    >
      <Title id="pass-video-heading">{HOW_TO_PASS_TITLE}</Title>
      <PassVideoPlayer />
      <PassVideoShare shareUrl={shareUrl} title={HOW_TO_PASS_TITLE} />
    </section>
  );
}

function PassVideoPlayer() {
  const [phase, setPhase] = useState<"poster" | "playing" | "error">("poster");
  const [ready, setReady] = useState(false);
  const { src, poster, captions } = HOW_TO_PASS_MEDIA;

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="home-video__frame" data-pass-video>
      {phase === "playing" ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          autoPlay
          aria-label={HOW_TO_PASS_TITLE}
          onError={() => setPhase("error")}
        >
          <track kind="captions" srcLang="en" label="English" src={captions} />
        </video>
      ) : (
        <>
          {/* Poster only until play. A plain img keeps this off the image optimizer and does not request the video. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            width={1200}
            height={675}
            decoding="async"
          />
          {phase === "poster" ? (
            <button
              type="button"
              className="home-video__play"
              data-ready={ready ? "true" : "false"}
              onClick={() => setPhase("playing")}
              aria-label={`Play video: ${HOW_TO_PASS_TITLE}`}
            >
              <IconPlay />
            </button>
          ) : (
            <p className="home-video__status" role="status">
              The video file is not available yet.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function PassVideoShare({ shareUrl, title }: { shareUrl: string; title: string }) {
  const [notice, setNotice] = useState("");
  const links = buildShareLinks(shareUrl, title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = shareUrl;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setNotice("Link copied");
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: title, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  return (
    <div className="home-share" role="group" aria-label="Share this video">
      <div className="home-share__primary">
        <button
          type="button"
          className="home-share__btn"
          aria-label="Share this video"
          onClick={() => void share()}
        >
          Share
        </button>
        <button type="button" className="home-share__btn" onClick={() => void copyLink()}>
          Copy link
        </button>
      </div>
      <ul className="home-share__links">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              {...(link.id === "email"
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="home-share__status" role="status">
        {notice}
      </p>
    </div>
  );
}
