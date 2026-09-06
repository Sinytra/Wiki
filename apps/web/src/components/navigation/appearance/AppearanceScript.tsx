import { APPLY_APPEARANCE_OPTIONS, applyStoredAppearance } from '@/lib/appearance';

const SCRIPT = `(${applyStoredAppearance.toString()})(${JSON.stringify(APPLY_APPEARANCE_OPTIONS)});`;

export default function AppearanceScript() {
  return <script>{SCRIPT}</script>;
}
