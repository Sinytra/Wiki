export default function DevProjectSectionTitle({title, desc, icon: Icon, ping}: {
  title: string;
  desc: string;
  icon: any;
  ping?: any;
}) {
  return (
    <div className="space-y-1 w-fit">
      <h3 className="text-lg font-medium flex flex-row items-center gap-2">
        {<Icon className="size-5"/>}
        {title}
        {ping}
      </h3>
      <p className="text-sm text-secondary">
        {desc}
      </p>
    </div>
  );
}