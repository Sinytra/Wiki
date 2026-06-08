import * as React from 'react';
import { ordinalColumn, TableColumn } from '@repo/ui/blocks/data-table/dataTableTypes';
import DataTable from '@repo/ui/blocks/data-table/DataTable';
import ResolvedProjectRecipe from '@/components/docs/shared/game/ResolvedProjectRecipe';
import { useTranslations } from 'next-intl';
import { ProjectContext, ProjectVersions } from '@repo/shared/types/service';
import { FullRecipeData, PaginatedData } from '@sinytra/wiki-api-types';
import DevProjectTableEmptyState from '@/components/dashboard/dev/table/DevProjectTableEmptyState';

function EmptyPlaceholder() {
  const t = useTranslations('DevProjectRecipesTable.empty');

  return (
    <DevProjectTableEmptyState>
      <p className="text-base">{t('title')}</p>
    </DevProjectTableEmptyState>
  );
}

export default function DevProjectRecipesTable({
  data,
  ctx,
  versions,
  page
}: {
  data: PaginatedData<FullRecipeData>;
  ctx: ProjectContext;
  versions: ProjectVersions;
  page: number;
}) {
  const t = useTranslations('DevProjectRecipesTable');

  const columns: TableColumn<FullRecipeData>[] = [
    ordinalColumn,
    {
      id: 'type',
      header: t('type'),
      cell: (recipe) => <div className="font-mono text-sm">{recipe.data.type}</div>
    },
    {
      id: 'id',
      header: t('id'),
      cell: (recipe) => <div className="font-mono text-sm">{recipe.id}</div>
    }
  ];

  const expander = (recipe: FullRecipeData) => (
    <div className="my-2 prose max-w-fit prose-invert">
      <ResolvedProjectRecipe recipe={recipe.data} ctx={ctx} embedded />
    </div>
  );

  return (
    <DataTable
      expandRows={expander}
      columns={columns}
      data={data}
      versions={versions}
      page={page}
      emptyState={<EmptyPlaceholder />}
    />
  );
}
