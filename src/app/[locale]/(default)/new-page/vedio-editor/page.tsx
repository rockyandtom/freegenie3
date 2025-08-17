import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import React from "react";
import VideoEditorClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 构建 canonical URL
  const canonicalUrl = locale === 'en' 
    ? 'https://freegenie3.com/new-page/vedio-editor'
    : `https://freegenie3.com/${locale}/new-page/vedio-editor`;

  return {
    title: "Free Image to Video AI - Create Videos Instantly | freegenie3",
    description: "Convert your images to stunning videos with our free image to video AI tool. freegenie3 makes it easy to generate captivating videos from any photo.",
    keywords: "free image to video ai, ai video, convert image to video with ai, image to video generator, free video maker, ai video creation",
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'canonical': canonicalUrl,
    },
  };
}

export default async function VideoEditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VideoEditorClient />;
}