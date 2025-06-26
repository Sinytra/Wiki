'use client'

import {ReactNode, useState} from "react";
import {cn} from "@repo/ui/lib/utils";
import {ChevronsDownIcon} from "lucide-react";
import {useTranslations} from "next-intl";

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
  expandedBody?: any;
  embedded?: boolean;
};

export default function ResponsiveTable({
                                          columns,
                                          rows,
                                          embedded,
                                          expandedBody
                                        }: ResponsiveTableProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations('ResponsiveTable');

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
      <tr>
        <td colSpan={columns.length} className="no-table-bs bg-table-soft! cursor-pointer group"
            onClick={() => setExpanded(!expanded)} data-open={expanded}>
          <div className="my-0.5 flex flex-row w-full justify-end gap-4 items-center text-secondary">
            <span className="text-sm">
              {t('expand')}
            </span>

            <span>
              <ChevronsDownIcon className="size-4 group-data-[open=true]:rotate-180" />
            </span>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={columns.length} className="no-table-bs no-table-padding">
            {expandedBody}
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}