import './styles.css'
import React from 'react';

function GenericTable({ data, columns, onDelete, onEditClick }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.accessor} className='th-style'>
              {column.label}
            </th>
          ))}
          <th className='th-style'>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id || item.codAdmin || item.codUser}>
            {columns.map(column => (
              <td key={column.accessor}>
                {item [column.accessor]}
              </td>
            ))}
            <td className='generic-td'>
              <button className='generic-button' onClick={() => onEditClick(item)}>Editar</button>
              <button className='generic-button' onClick={() => onDelete(item.id || item.codAdmin || item.codUser)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GenericTable;
