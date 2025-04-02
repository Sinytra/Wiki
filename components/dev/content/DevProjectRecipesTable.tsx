import {ProjectContentRecipe} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import {PaginatedData, ProjectVersions} from "@/lib/service";
import DevProjectContentTable from "@/components/dev/content/DevProjectContentTable";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import {TableColumn, TableRouteParams} from "@/lib/types/tableTypes";

export default function DevProjectRecipesTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentRecipe>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const columns: TableColumn<ProjectContentRecipe>[] = [
    {
      id: 'select',
      header: 'Num.',
      cell: (_, i) => (
        <div className="text-center">{i + 1}</div>
      ),
      className: 'w-15'
    },
    {
      id: 'type',
      header: 'Type',
      cell: recipe => (
        <div className="font-mono text-sm">{recipe.type}</div>
      )
    },
    {
      id: 'id',
      header: 'Identifier',
      cell: recipe => (
        <div className="font-mono text-sm">{recipe.id}</div>
      )
    }
  ];

  const expander = (recipe: ProjectContentRecipe) => (
    <div className="my-2 prose prose-invert max-w-fit">
      <ResolvedProjectRecipe project={params.slug} recipe={recipe.data} embedded/>
    </div>
  );

  return (
    <DevProjectContentTable expandRows={expander} columns={columns} data={data} params={params} versions={versions}
                            page={page}/>
  )
}