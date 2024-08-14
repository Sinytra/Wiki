export default async function ModLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full items-center mx-6">
      <div className="max-w-5xl w-full">
        {children}
      </div>
    </div>
  );
}