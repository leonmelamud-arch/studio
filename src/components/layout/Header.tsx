import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const logo = PlaceHolderImages.find(img => img.id === 'mcp-logo');

export function Header() {
  return (
    <header className="py-6 px-4 flex justify-between items-center w-full">
      <div className="w-14"></div>
      <div className="flex items-center gap-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary font-headline">
          HypnoRaffle
        </h1>
      </div>
       {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={56}
            height={56}
            className="rounded-full shadow-lg border-2 border-primary"
            data-ai-hint={logo.imageHint}
          />
        )}
    </header>
  );
}
