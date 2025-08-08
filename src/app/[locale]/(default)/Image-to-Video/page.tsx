import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import ImageToVideoClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "AI Image to Video Generator - Genie 3",
    description: "Transform your static images into dynamic videos with Genie 3's powerful AI technology. Upload an image and create amazing video content.",
    keywords: "genie 3, image to video, AI video generation, photo animation, video creator",
  };
}

export default async function ImageToVideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ImageToVideoClient />;
}