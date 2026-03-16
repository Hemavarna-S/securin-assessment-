import React, { useEffect, useState } from "react";
import { Layout, Drawer, Descriptions, Collapse, Input, Row, Col } from "antd";
import axios from "axios";
import RecipeTable from "./components/RecipeTable";
import NutritionTable from "./components/NutritionTable";
const { Header, Content } = Layout;
const { Panel } = Collapse;
const { Search } = Input;
const API_BASE = "http://localhost:5000/api";
function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  });
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchRecipes(pagination.current, pagination.pageSize);
  }, []);
  const fetchRecipes = async (page, limit) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/recipes`, {
        params: { page, limit }
      });
      setRecipes(res.data.data);
      setPagination({
        current: page,
        pageSize: limit,
        total: res.data.total
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  const handleTableChange = (paginationInfo) => {
    fetchRecipes(paginationInfo.current, paginationInfo.pageSize);
  };
  const handleRowClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDrawerOpen(true);
  };
  const handleSearch = async (value) => {
    setSearchText(value);
    if (!value) {
      fetchRecipes(1, pagination.pageSize);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/recipes/search`, {
        params: { title: value }
      });
      setRecipes(res.data.data);
      setPagination({
        ...pagination,
        total: res.data.total
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "#fff", fontSize: 20 }}>
        Recipe Dashboard
      </Header>
      <Content style={{ padding: 30 }}>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Search
              placeholder="Search recipe title..."
              allowClear
              enterButton
              onSearch={handleSearch}
            />
          </Col>
        </Row>
        <RecipeTable
          recipes={recipes}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["15", "20", "30", "50"]
          }}
          onChange={handleTableChange}
          onRowClick={handleRowClick}
        />
        <Drawer
          title={`${selectedRecipe?.title} (${selectedRecipe?.cuisine})`}
          width={450}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {selectedRecipe && (
            <>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Description">
                  {selectedRecipe.description}
                </Descriptions.Item>
                <Descriptions.Item label="Serves">
                  {selectedRecipe.serves}
                </Descriptions.Item>
                <Descriptions.Item label="Total Time">
                  <Collapse>
                    <Panel header={`${selectedRecipe.total_time} mins`} key="1">
                      <p>Prep Time: {selectedRecipe.prep_time} mins</p>
                      <p>Cook Time: {selectedRecipe.cook_time} mins</p>
                    </Panel>
                  </Collapse>
                </Descriptions.Item>
              </Descriptions>
              <NutritionTable nutrients={selectedRecipe.nutrients} />
            </>
          )}
        </Drawer>
      </Content>
    </Layout>
  );
}
export default App;