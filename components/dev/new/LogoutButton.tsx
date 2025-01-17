import {signOut} from "@/lib/auth";

export default function LogoutButton({children}: { children: any }) {
  return (
    <form
      title="Logout"
      action={async () => {
        "use server"
        await signOut({redirectTo: '/'});
      }}
    >
      {children}
    </form>
  );
}