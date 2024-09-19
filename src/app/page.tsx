import {AuroraBackground} from "@/components/ui/aurora-background";
import ExpandableCardDemo from "@/components/blocks/expandable-card-demo-standard";

export default function Home() {
  return (
      <main className="relative mx-auto flex flex-col items-center justify-center overflow-clip px-5 bg-black sm:px-10">
          <div className="w-full">
              <AuroraBackground className="z-0" showRadialGradient={true}>
                  <h1 className="text-3xl font-bold text-black">Connect your Spotify</h1>
              </AuroraBackground>
          </div>
      </main>
  );
}
