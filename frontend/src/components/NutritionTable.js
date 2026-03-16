import React from "react";
import { Table } from "antd";

const NutritionTable = ({ nutrients }) => {

  if (!nutrients) return null;

  const data = [
    { key: "1", name: "Calories", value: nutrients.calories },
    { key: "2", name: "Carbohydrates", value: nutrients.carbohydrateContent },
    { key: "3", name: "Cholesterol", value: nutrients.cholesterolContent },
    { key: "4", name: "Fiber", value: nutrients.fiberContent },
    { key: "5", name: "Protein", value: nutrients.proteinContent },
    { key: "6", name: "Saturated Fat", value: nutrients.saturatedFatContent },
    { key: "7", name: "Sodium", value: nutrients.sodiumContent },
    { key: "8", name: "Sugar", value: nutrients.sugarContent },
    { key: "9", name: "Fat", value: nutrients.fatContent }
  ];

  const columns = [
    {
      title: "Nutrient",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value"
    }
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Nutrition</h3>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default NutritionTable;