import { ReactNode, type JSX } from "react";

export interface TableRouteParams {
  locale: string;
  slug: string;
  version: string;
}

export interface TableColumn<T> {
  id: string;
  header: string;
  cell: (item: T, index: number, params: TableRouteParams) => JSX.Element | null;
  className?: string;
}

export interface TableRowData {
  row: ReactNode;
  extendedRow?: ReactNode;
}

export type TableRowLinker<T> = (data: T) => string;

export const ordinalColumn: TableColumn<any> = {
  id: 'select',
  header: 'Num.',
  cell: (_, i) => (
    <div className="text-center">{i + 1}</div>
  ),
  className: 'w-15'
}