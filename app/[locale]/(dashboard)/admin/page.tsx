import {setContextLocale} from "@/lib/locales/routing";
import {assertUserIsAdmin} from "@/lib/admin";
import adminApi from "@/lib/service/remote/adminApi";
import Asset from "@/components/docs/shared/Asset";
import {PencilRulerIcon, TagIcon, UsersIcon, WrenchIcon} from "lucide-react";
import {ReactNode} from "react";

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    locale: string;
  }
}

function AdminHeader() {
  return (
    <div className="w-full flex flex-row bg-primary-alt rounded-sm border border-secondary p-2 shadow-sm justify-between">
      <span className="text-lg flex flex-row gap-2 items-center">
        <WrenchIcon className="size-5" />
        System configuration
      </span>

      <span className="text-base flex flex-row gap-2 items-center">
        <img src="https://sinytra.org/logo.png" className="size-5" alt="Sinytra" />
        Sinytra
      </span>
    </div>
  )
}

function DataWidget({title, value, icon}: { title: string; value: any; icon: ReactNode; }) {
  return (
    <div className="bg-accent flex flex-row border border-secondary rounded-sm [&>div]:py-1">
      <div className="bg-primary flex flex-row items-center gap-2 pl-2 pr-2 border-r rounded-sm border-secondary">
        <div className="text-primary">
          {icon}
        </div>

        <span className="text-sm font-medium">
          {title}
        </span>
      </div>
      <div className="px-2 min-w-10 text-center rounded-sm">
        <span className="text-sm font-mono">
          {value}
        </span>
      </div>
    </div>
  )
}

export default async function AdminPanelHome({params}: Props) {
  setContextLocale(params.locale);

  await assertUserIsAdmin();
  const systemInfo = await adminApi.getSystemInfo(params);
  // TODO Util func
  if ('status' in systemInfo) {
    throw new Error("Unexpected response status: " + systemInfo.status);
  }

  return (
    <div className="flex flex-col gap-y-4">
      <AdminHeader />

      <div className="flex flex-row flex-wrap gap-4">
        <DataWidget
          title="System version"
          value={`${systemInfo.version} + ${systemInfo.version_hash}`}
          icon={
            <TagIcon width={18} height={18} />
          }
        />

        <DataWidget
          title="Game version"
          value={systemInfo.latest_data.game_version}
          icon={
            <Asset location="minecraft:grass_block" width={20} height={20} />
          }
        />

        <DataWidget
          title="Loader version"
          value={systemInfo.latest_data.loader_version}
          icon={
            <img src="/blog-assets/neo_logo.png" width={20} height={20} alt="Loader" />
          }
        />

        <DataWidget
          title="Total projects"
          value={systemInfo.stats.projects}
          icon={
            <PencilRulerIcon width={18} height={18} />
          }
        />

        <DataWidget
          title="Total users"
          value={systemInfo.stats.users}
          icon={
            <UsersIcon width={18} height={18} />
          }
        />
      </div>
    </div>
  )
}