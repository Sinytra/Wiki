import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import github from "@/lib/github/github";
import {CollaboratorRepositoryPermissions} from "@/lib/github/githubApp";

function hasSufficientAccess(data: CollaboratorRepositoryPermissions): boolean {
  return data?.admin === true || data?.maintain === true;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL('/en/auth/login', request.url));
  }

  try {
    const installations = await github.getUserAccessibleInstallations(session.access_token);
    const repositories = await Promise.all(installations.map(async id => github.getAccessibleAppRepositories(session.access_token, id)));
    const allRepos = repositories.flatMap(a => a);
    const hasAccessTo = allRepos.filter(r => hasSufficientAccess(r.permissions));

    return NextResponse.json({
      installations,
      allRepos: allRepos.map(r => r.full_name),
      accessibleRepos: hasAccessTo.map(r => r.full_name)
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: e});
  }
}