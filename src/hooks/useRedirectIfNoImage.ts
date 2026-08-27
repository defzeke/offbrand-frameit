import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRedirectIfNoImage(imageUrl: string | null | undefined) {
  const router = useRouter();
  useEffect(() => {
    if (!imageUrl) {
      router.push('/upload');
    }
  }, [imageUrl, router]);
}
