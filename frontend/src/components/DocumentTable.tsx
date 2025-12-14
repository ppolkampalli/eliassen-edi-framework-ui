import { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState
} from '@tanstack/react-table';
import type { DocumentSummary } from '../../../shared/types/document.types';

interface DocumentTableProps {
  documents: DocumentSummary[];
}

const columnHelper = createColumnHelper<DocumentSummary>();

export function DocumentTable({ documents }: DocumentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  // Reset pagination when documents change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [documents]);

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('wfid', {
        header: 'Workflow ID',
        cell: info => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor('sourceId', {
        header: 'Source',
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('destinationId', {
        header: 'Destination',
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('documentType', {
        header: 'Doc Type',
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('reference', {
        header: 'Reference',
        cell: info => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor('invoiceNumber', {
        header: 'Invoice #',
        cell: info => {
          const invoiceNum = info.getValue();
          return invoiceNum ? (
            <span className="font-mono text-sm">{invoiceNum}</span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('transactionStatus', {
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const colorClass = status === 'SENT' ? 'bg-green-100 text-green-800' :
                            status === 'ERROR' ? 'bg-red-100 text-red-800' :
                            status === 'RECEIVED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800';
          return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
              {status}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('direction', {
        header: 'Dir',
        cell: info => (
          <span className={`font-semibold ${info.getValue() === 'O' ? 'text-blue-600' : 'text-orange-600'}`}>
            {info.getValue() === 'O' ? 'OUT' : 'IN'}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('transactionLastDateTime', {
        header: 'Last Updated',
        cell: info => formatDate(info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor('inboundMessageFilename', {
        header: 'Inbound File',
        cell: info => info.getValue() || '-',
        enableSorting: true,
      }),
      columnHelper.accessor('outboundMessageFilename', {
        header: 'Outbound File',
        cell: info => info.getValue() || '-',
        enableSorting: true,
      }),
      columnHelper.accessor('interchangeNumber', {
        header: 'Int #',
        cell: info => info.getValue() || '-',
        enableSorting: true,
      }),
      columnHelper.accessor('groupNumber', {
        header: 'Grp #',
        cell: info => info.getValue() || '-',
        enableSorting: true,
      }),
      columnHelper.accessor('transactionNumber', {
        header: 'Trx #',
        cell: info => info.getValue() || '-',
        enableSorting: true,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: documents,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Global search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-2'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'>>'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="text-sm text-gray-700">
            Showing{' '}
            <strong>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </strong>
            {' '}-{' '}
            <strong>
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </strong>
            {' '}of{' '}
            <strong>{table.getFilteredRowModel().rows.length}</strong>
            {' '}results
          </span>

          <span className="text-sm text-gray-700">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount() || 1}
            </strong>
          </span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            {[10, 25, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
