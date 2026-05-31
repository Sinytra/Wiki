import {ProjectContext} from '@repo/shared/types/service';
import Asset from '@/components/docs/shared/asset/Asset';

export default function InvSlotDisplay({id, ctx}: { id: string; ctx: ProjectContext }) {
  return (
    <div className={`
      relative inline-block h-8 w-8 border-2 border-solid border-t-[#373737] border-r-white border-b-white
      border-l-[#373737] bg-[#8B8B8B] bg-[length:32px_32px] bg-center bg-no-repeat text-left align-bottom text-base
      leading-none before:pointer-events-none before:absolute before:-bottom-0.5 before:-left-0.5 before:h-0.5
      before:w-0.5 before:bg-[#8B8B8B] before:content-[''] after:pointer-events-none after:absolute after:-top-0.5
      after:-right-0.5 after:h-0.5 after:w-0.5 after:bg-[#8B8B8B] after:content-['']
    `}>
      <Asset location={id} ctx={ctx} />
    </div>
  );
}
