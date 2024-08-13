import {signIn} from "@/lib/auth";

export default async function Login() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("modrinth", { redirectTo: '/dev' })
      }}
    >
      <button type="submit" className="bg-green-600 p-3 px-5 rounded-sm">
        Log in with Modrinth
      </button>
    </form>
  )
}