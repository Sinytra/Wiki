import * as React from "react";
import {ordinalColumn, TableColumn, TableRouteParams} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import {useTranslations} from "next-intl";
import {PaginatedData, ProjectVersions} from "@repo/shared/types/service";
import {ProjectContentRecipe} from "@repo/shared/types/api/devProject";

export default function DevProjectRecipesTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentRecipe>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const t = useTranslations('DevProjectRecipesTable');

  const columns: TableColumn<ProjectContentRecipe>[] = [
    ordinalColumn,
    {
      id: 'type',
      header: t('type'),
      cell: recipe => (
        <div className="font-mono text-sm">{recipe.data.type}</div>
      )
    },
    {
      id: 'id',
      header: t('id'),
      cell: recipe => (
        <div className="font-mono text-sm">{recipe.id}</div>
      )
    }
  ];

  const expander = (recipe: ProjectContentRecipe) => (
    <div className="prose prose-invert my-2 max-w-fit">
      <ResolvedProjectRecipe project={params.slug} recipe={recipe.data} params={params} embedded/>
    </div>
  );

  return (
    <DataTable expandRows={expander} columns={columns} data={data} params={params} versions={versions}
               page={page}/>
  )
}