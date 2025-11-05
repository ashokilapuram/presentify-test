import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Table row component for chart data input
 */
const TableRow = ({ 
  label, 
  rowIndex, 
  series, 
  chartType,
  onLabelChange, 
  onValueChange, 
  onRemoveRow, 
  onKeyDown 
}) => {
  return (
    <tr>
      <td className="table-cell">
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(rowIndex, e.target.value)}
          className="table-input"
          data-col="0"
          onKeyDown={(e) => onKeyDown(e, rowIndex, 0)}
        />
      </td>
      {series.map((s, seriesIndex) => (
        <td key={seriesIndex} className="table-cell">
          <input
            type="number"
            value={s.values[rowIndex] ?? 0}
            onChange={(e) => onValueChange(seriesIndex, rowIndex, e.target.value)}
            className="table-input"
            data-col={seriesIndex + 1}
            min={chartType === 'bar' ? undefined : "0"}
            onKeyDown={(e) => onKeyDown(e, rowIndex, seriesIndex + 1)}
          />
        </td>
      ))}
      <td className="table-cell actions-cell">
        <button
          onClick={() => onRemoveRow(rowIndex)}
          className="remove-row-button"
          title="Remove row"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
};

export default TableRow;

