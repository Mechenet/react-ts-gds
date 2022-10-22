import { ReactElement } from "react"
import { useTable, useSortBy, TableOptions, SortingRule } from "react-table"
import { IoArrowDown, IoArrowUp } from "react-icons/io5"
import { v4 as uuidv4 } from "uuid"

interface TableProperties<T extends object> extends Record<string, unknown>, TableOptions<T> {
  caption?: string
  sortBy?: SortingRule<string>[]
}

export const Table = <T extends object>(props: TableProperties<T>): ReactElement => {
  const { caption, data, columns, sortBy } = props
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: sortBy
      }
    },
    useSortBy
  )

  return (
    <table className="govuk-table" {...getTableProps()}>
      {caption && (
        <caption className="govuk-table__caption govuk-table__caption--m">{caption}</caption>
      )}
      <thead className="govuk-table__head">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {headerGroup.headers.map((column: any) => (
              <th
                className="govuk-table__header"
                aria-sort={
                  column.isSorted ? (column.isSortedDesc ? "descending" : "ascending") : "none"
                }
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={uuidv4()}>
                <span className="govuk-table__header-sortable">
                  {column.render("Header")}
                  {column.isSorted ? column.isSortedDesc ? <IoArrowDown /> : <IoArrowUp /> : null}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="govuk-table__body" {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr className="govuk-table__row" {...row.getRowProps()} key={uuidv4()}>
              {row.cells.map((cell, index) => {
                return index === 0 ? (
                  <th scope="row" className="govuk-table__header" {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </th>
                ) : (
                  <td className="govuk-table__cell" {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
