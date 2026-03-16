import React from "react";
import { Drawer, Descriptions, Collapse } from "antd";
import NutritionTable from "./NutritionTable";
const { Panel } = Collapse;
const RecipeDrawer = ({ recipe, open, onClose }) => {
  if (!recipe) return null;
  return (
    <Drawer
      title={`${recipe.title} (${recipe.cuisine})`}
      width={420}
      open={open}
      onClose={onClose}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Description">
          {recipe.description}
        </Descriptions.Item>
        <Descriptions.Item label="Total Time">
          <Collapse>
            <Panel header={recipe.total_time} key="1">
              <p>Prep Time: {recipe.prep_time}</p>
              <p>Cook Time: {recipe.cook_time}</p>
            </Panel>
          </Collapse>
        </Descriptions.Item>
        <Descriptions.Item label="Serves">
          {recipe.serves}
        </Descriptions.Item>
      </Descriptions>
      <h3 style={{ marginTop: 20 }}>Nutrition</h3>
      <NutritionTable nutrients={recipe.nutrients} />
    </Drawer>
  );
};
export default RecipeDrawer;