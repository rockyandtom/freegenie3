import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import React from "react";
import ImageEditorClient from "./client";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    // 构建 canonical URL
    const canonicalUrl = locale === 'en'
        ? 'https://freegenie3.com/new-page/image-editor'
        : `https://freegenie3.com/${locale}/new-page/image-editor`;

    return {
        title: "Freegenie3: Best AI Watermark Remover Online",
        description: "Discover freegenie3, the ultimate AI-powered watermark remover. Effortlessly remove watermarks from your images and unlock creative possibilities with our advanced AI image generation features.",
        keywords: "AI watermark remover, watermark remover online, remove watermark from image, AI image editor, free watermark remover, image editing tool",
        alternates: {
            canonical: canonicalUrl,
        },
        other: {
            'canonical': canonicalUrl,
        },
    };
}

export default async function ImageEditorPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <ImageEditorClient />;
}