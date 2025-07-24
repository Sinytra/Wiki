export default function DocsSimpleHeader({children}: { children?: any }) {
  return (
    <header className="w-full border-b border-tertiary px-0 pt-1 pb-2 lg:hidden">
      <h1 className="text-center text-lg font-bold">
        {children}
      </h1>
    </header>
  )
}