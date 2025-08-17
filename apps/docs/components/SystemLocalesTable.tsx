import systemApi from '@repo/shared/api/systemApi';
import { Table } from 'nextra/components';

export default async function SystemLocalesTable() {
  const locales = await systemApi.getSupportedLocales();
  if (!locales.success) {
    return null;
  }
  const data = locales.data.filter(l => l.id != 'en');

  return (
    <div className="mt-5">
      <Table>
        <thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Code</Table.Th>
        </Table.Tr>
        </thead>
        <tbody>
        {data.map(locale => (
          <Table.Tr key={locale.id}>
            <Table.Td>{locale.name}</Table.Td>
            <Table.Td>{locale.code}</Table.Td>
          </Table.Tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}