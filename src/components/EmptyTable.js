import React from "react";

const EmptyTable = ({ text }) => (
    <tr className="empty-table-row">
        <td className="empty-table">{text}</td>
    </tr>
);

export default EmptyTable;
