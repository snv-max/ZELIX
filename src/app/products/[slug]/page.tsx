import React from 'react';
import { notFound } from 'next/navigation';
import { fetchProductBySlug } from '@/lib/data';
import ProductDetailsClient from './ProductDetailsClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchProductBySlug(resolvedParams.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | ZELIX`,
      description: product.description.substring(0, 160),
      images: [
        {
          url: product.images[0] || '/logo.png',
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await fetchProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
