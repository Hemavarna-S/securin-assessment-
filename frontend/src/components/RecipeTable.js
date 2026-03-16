import React from "react";
import { Table, Rate, Empty } from "antd";

const RecipeTable = ({ recipes, loading, onRowClick, pagination, onChange }) => {

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    },
    {
      title: "Cuisine",
      dataIndex: "cuisine",
      key: "cuisine"
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Rate allowHalf disabled defaultValue={rating || 0} />
      )
    },
    {
      title: "Total Time",
      dataIndex: "total_time",
      key: "total_time",
      render: (time) => `${time || 0} mins`
    },
    {
      title: "Serves",
      dataIndex: "serves",
      key: "serves"
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={recipes}
      loading={loading}
      rowKey="id"
      pagination={pagination}
      onChange={onChange}
      locale={{
        emptyText: <Empty description="No Recipes Found" />
      }}
      onRow={(record) => ({
        onClick: () => onRowClick(record)
      })}
    />
  );
};

export default RecipeTable;