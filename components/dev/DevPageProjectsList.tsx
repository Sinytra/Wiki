'use client'

import LoadingContent from "@/components/util/LoadingContent";
import * as React from "react";
import {Suspense, useContext} from "react";
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";

function ProfileProjectsLoading() {
  return (
    <div className="w-full flex justify-center items-center h-[185px] border-none">
      <LoadingContent/>
    </div>
  );
}

export default function DevPageProjectsList({children}: { children: any }) {
  const {loading} = useContext(GetStartedContext)!;

  return (
    <Suspense fallback={<ProfileProjectsLoading/>}>
      {loading ? <ProfileProjectsLoading/> : children}
    </Suspense>
  )
}