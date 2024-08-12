export default function ModSearch() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <span className="text-primary text-lg">Browse mod documentation</span>

      <input type="text" className="bg-alt text-base text-center text-gray-500 w-96 p-3 rounded-sm focus:outline-none"
             placeholder="Search for a mod..."/>
    </div>
  )
}