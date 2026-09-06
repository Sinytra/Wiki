import { Badge } from '@repo/ui/components/badge';
import { NavLink } from '@/components/navigation/link/NavLink';

export default function BlogHeader({ hideSubtext }: { hideSubtext: boolean }) {
  return (
    <div className="my-8 flex flex-col items-center justify-center text-center">
      <img
        style={{ marginBottom: '1.5rem' }}
        src="https://sinytra.org/logo.png"
        width={124}
        height={124}
        alt="Sinytra logo"
      />

      <NavLink
        href="/blog"
        className="flex flex-col items-center text-primary no-underline! sm:flex-row"
        style={{ fontSize: '2rem', marginBottom: '0.1rem' }}
      >
        Modded Minecraft Wiki
        <Badge className="ml-3 text-lg" variant="secondary">
          Blog
        </Badge>
      </NavLink>
      {(hideSubtext ?? false) ? (
        <></>
      ) : (
        <span className="text-secondary" style={{ fontSize: '1.5rem' }}>
          The Wiki for all of Modded Minecraft. Presented by Sinytra.
        </span>
      )}
    </div>
  );
}
