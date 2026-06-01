const DataTable = ({ columns, rows, actions }) => (
  <div className="table-shell glass-card">
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
          {actions ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row._id || index}>
            {columns.map((column) => (
              <td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key]}</td>
            ))}
            {actions ? <td className="table-actions">{actions(row)}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
