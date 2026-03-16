import React, { useEffect, useState } from "react";
import { Table, Rate, Input, Select, Pagination, Empty } from "antd";
import { fetchRecipes, searchRecipes } from "../services/api";
import RecipeDrawer from "../components/RecipeDrawer";
const { Option } = Select;
const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
    total_time: ""
  });
  useEffect(() => {
    loadRecipes();
  }, [page, limit]);
  const loadRecipes = async () => {
    setLoading(true);
    const res = await fetchRecipes(page, limit);
    setRecipes(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  };
  const handleSearch = async () => {
    const res = await searchRecipes(filters);
    setRecipes(res.data.data);
    setTotal(res.data.total);
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      ellipsis: true
    },
    {
      title: "Cuisine",
      dataIndex: "cuisine"
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (rating) => <Rate disabled value={rating} />
    },
    {
      title: "Total Time",
      dataIndex: "total_time"
    },
    {
      title: "Serves",
      dataIndex: "serves"
    }
  ];
  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Input
          placeholder="Title"
          onChange={(e) =>
            setFilters({ ...filters, title: e.target.value })
          }
        />
        <Input
          placeholder="Cuisine"
          onChange={(e) =>
            setFilters({ ...filters, cuisine: e.target.value })
          }
        />
        <Input
          placeholder="Rating (>=4)"
          onChange={(e) =>
            setFilters({ ...filters, rating: e.target.value })
          }
        />
        <Input
          placeholder="Total Time (<=30)"
          onChange={(e) =>
            setFilters({ ...filters, total_time: e.target.value })
          }
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <Table
        columns={columns}
        dataSource={recipes}
        loading={loading}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: <Empty description="No recipes found" />
        }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedRecipe(record);
            setDrawerOpen(true);
          }
        })}
      />
      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        showSizeChanger
        pageSizeOptions={["15", "20", "30", "50"]}
        onChange={(p, l) => {
          setPage(p);
          setLimit(l);
        }}
        style={{ marginTop: 20 }}
      />
      <RecipeDrawer
        open={drawerOpen}
        recipe={selectedRecipe}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};
export default RecipesPage;