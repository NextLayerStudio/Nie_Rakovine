import { LoadingScreen } from "@/components/LoadingScreen";
import { SplashRedirect } from "./SplashRedirect";

/** First screen — brand loading, then continue to welcome. */
export default function SplashScreen() {
  return (
    <>
      <LoadingScreen />
      <SplashRedirect href="/welcome" delayMs={2200} />
    </>
  );
}
