import {ProjectContentRecipe} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import {PaginatedData, ProjectVersions} from "@/lib/service";
import DataTable from "@/components/base/data-table/DataTable";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import {ordinalColumn, TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";

export default function DevProjectRecipesTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentRecipe>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const columns: TableColumn<ProjectContentRecipe>[] = [
    ordinalColumn,
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
    <DataTable expandRows={expander} columns={columns} data={data} params={params} versions={versions}
               page={page}/>
  )
}