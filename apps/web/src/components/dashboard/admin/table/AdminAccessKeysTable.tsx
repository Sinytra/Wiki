import * as React from "react";
import {AccessKey, AccessKeys} from "@repo/shared/types/api/admin";
import {TableColumn} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import {cn} from "@repo/ui/lib/utils";
import CreateAccessKeyModal from "@/components/dashboard/admin/modal/CreateAccessKeyModal";
import {handleCreateAccessKeyForm, handleDeleteAccessKeyForm} from "@/lib/forms/actions";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import DeleteAccessKeyModal from "@/components/dashboard/admin/modal/DeleteAccessKeyModal";

export default function AdminAccessKeysTable({data, page}: {
  data: AccessKeys;
  page: number;
}) {
  const columns: TableColumn<AccessKey>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: item => (
        <span>{item.id}</span>
      )
    },
    {
      id: 'name',
      header: 'Name',
      cell: item => (
        <span>{item.name}</span>
      )
    },
    {
      id: 'user_id',
      header: 'User',
      cell: item => (
        <span>{item.user_id}</span>
      )
    },
    {
      id: 'expires_at',
      header: 'Expires at',
      cell: item => (
        <span>{item.expires_at || '-'}</span>
      )
    },
    {
      id: 'expired',
      header: 'Expired',
      cell: item => (
        <span className={cn(item.expired ? 'text-destructive' : 'text-success')}>{item.expired ? 'Yes' : 'No'}</span>
      )
    },
    {
      id: 'created_at',
      header: 'Created at',
      cell: item => (
        <span>{item.created_at}</span>
      )
    },
    {
      id: 'delete',
      header: '',
      cell: item => (
        <ClientLocaleProvider keys={['DeleteAccessKeyModal']}>
          <DeleteAccessKeyModal accessKey={item} action={handleDeleteAccessKeyForm.bind(null, item.id)} />
        </ClientLocaleProvider>
      ),
      className: 'w-14'
    }
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} page={page} creator={
        <ClientLocaleProvider
          keys={['CreateAccessKeyModal', 'FormActions', 'SubmitButton', 'SaveAccessKeyModal', 'CopyButton']}
        >
          <CreateAccessKeyModal formAction={handleCreateAccessKeyForm}/>
        </ClientLocaleProvider>
      }/>
    </div>
  )
}