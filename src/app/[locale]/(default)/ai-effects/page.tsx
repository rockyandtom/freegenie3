import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import React from "react";
import AIEffectsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 构建 canonical URL
  const canonicalUrl = locale === 'en' 
    ? 'https://freegenie3.com/ai-effects'
    : `https://freegenie3.com/${locale}/ai-effects`;

  return {
    title: "AI Kissing Video Generator Free | Create Realistic Kissing Videos - Genie 3",
    description: "Create stunning and realistic AI kissing videos for free with Freegenie3's powerful AI video effects. Our AI kissing video generator is completely free and easy to use.",
    keywords: "AI Kissing Video Generator Free, ai video effects, kissing ai, free AI video generator, realistic kissing videos, AI video creation",
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'canonical': canonicalUrl,
    },
  };
}

export default async function AIEffectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AIEffectsClient />;
}