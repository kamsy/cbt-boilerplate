import React from "react";
import { Select } from "antd";
const { Option } = Select;

const TableSelectFilters = ({ handler }) => {
    return (
        <div className="filter-container">
            <span className="filter-text">Filter by: </span>
            <Select
                defaultValue="all_time"
                style={{ width: 120 }}
                onChange={handler}>
                <Option value="today">Today</Option>
                <Option value="yesterday">Yesterday</Option>
                <Option value="this_week">This Week</Option>
                <Option value="this_month">This Month</Option>
                <Option value="all_time">All Time</Option>
            </Select>
        </div>
    );
};

export default TableSelectFilters;
