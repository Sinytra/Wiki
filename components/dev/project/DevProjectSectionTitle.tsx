export default function DevProjectSectionTitle({title, desc, icon: Icon, ping}: {
  title: string;
  desc: string;
  icon: any;
  ping?: any;
}) {
  return (
    <div className="w-fit space-y-1">
      <h3 className="flex flex-row items-center gap-2 text-lg font-medium">
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