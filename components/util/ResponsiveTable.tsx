import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type Column = {
  key: string;
  label: string;
};

type Data = {
  className?: any;
  data: ReactNode;
}

type ResponsiveTableProps = {
  columns: Column[];
  rows: Record<string, Data>[];
  embedded?: boolean;
};

export default function ResponsiveTable({
                                          columns,
                                          rows,
                                          embedded
                                        }: ResponsiveTableProps) {
  return (
    <table className={cn('[&_td]:bg-primary-alt/50', embedded && 'mb-0')}>
      <thead className="hidden sm:table-header-group">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className=""
          >
            {col.label}
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {rows.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="block border-0 sm:table-row"
        >
          {columns.map((col) => (
            <td
              key={col.key}
              className={cn('block border-b sm:table-cell sm:border', row[col.key].className)}
              data-label={col.label}
            >
              <div className="mb-1 font-semibold text-primary-alt sm:hidden">
                {col.label}
              </div>
              <div>{row[col.key].data}</div>
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
}