import {ReactNode} from "react";

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