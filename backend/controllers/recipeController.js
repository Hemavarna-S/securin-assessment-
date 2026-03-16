const Recipe=require('../models/Recipe');
const { parseNumber }=require('../utils/parseUtils');
const addRecipe = async (req, res) => {
  try {
    const { cuisine,title,rating,prep_time,cook_time,total_time,description,nutrients,serves }=req.body;
    if (!title) {
      return res.status(400).json({ message:'Title is required' });
    }
    const recipe = new Recipe({
      cuisine,
      title,
      rating:parseNumber(rating),
      prep_time:parseNumber(prep_time),
      cook_time:parseNumber(cook_time),
      total_time:parseNumber(total_time),
      description,
      nutrients:nutrients || {},
      serves
    });
    const savedRecipe=await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
const getRecipes=async (req, res) => {
  try {
    const page=Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit=Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip=(page - 1) * limit;
    const [totalResults, recipes] = await Promise.all([
      Recipe.countDocuments(),
      Recipe.find()
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
    ]);
    const totalPages=Math.ceil(totalResults / limit) || 1;
    const data=recipes.map(r => ({
      id: r._id.toString(),
      title: r.title,
      cuisine: r.cuisine,
      rating: r.rating,
      prep_time: r.prep_time,
      cook_time: r.cook_time,
      total_time: r.total_time,
      description: r.description,
      nutrients: r.nutrients,
      serves: r.serves
    }));
    res.json({
      page,
      limit,
      total:totalResults,
      data
    });
  } catch (error) {
    res.status(500).json({message:error.message });
  }
};
module.exports = { addRecipe, getRecipes };
function parseOperatorParam(param) {
  if (!param) return null;
  const m=String(param).match(/^\s*(<=|>=|=|<|>)?\s*(\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const op=m[1]||'=';
  const val=parseFloat(m[2]);
  switch (op) {
    case '<':
    case '<=': return { $lte: val };
    case '>':
    case '>=': return { $gte: val };
    case '=':
    default: return val;
  }
}
const searchRecipes=async (req, res) => {
  try {
    const { calories,title,cuisine,total_time,rating}=req.query;
    const mongoQuery={};
    if (title) mongoQuery.title={ $regex:title,$options:'i'};
    if (cuisine) mongoQuery.cuisine=cuisine;
    const ratingCond=parseOperatorParam(rating);
    if (ratingCond!==null) {
      if (typeof ratingCond==='number') mongoQuery.rating = ratingCond;
      else mongoQuery.rating=ratingCond;
    }
    const totalTimeCond=parseOperatorParam(total_time);
    if (totalTimeCond!==null) {
      if (typeof totalTimeCond==='number') mongoQuery.total_time = totalTimeCond;
      else mongoQuery.total_time=totalTimeCond;
    }
    const docs=await Recipe.find(mongoQuery).limit(2000);
    let results=docs;
    if (calories) {
      const m=String(calories).match(/^(<=|>=|=|<|>)?\s*(\d+(?:\.\d+)?)$/);
      if (!m) return res.status(400).json({ message: 'Invalid calories filter' });
      const op = m[1]||'=';
      const val=parseFloat(m[2]);
      const compare =(num)=>{
        if (num === null) return false;
        if (op ==='<'||op ==='<=') return num <= val;
        if (op ==='>'||op ==='>=') return num >= val;
        return num === val;
      };
      results=docs.filter(d => {
        const calStr=d.nutrients && d.nutrients.calories;
        if (!calStr) return false;
        const mm=String(calStr).match(/(\d+(?:\.\d+)?)/);
        if (!mm) return false;
        const calNum =parseFloat(mm[1]);
        return compare(calNum);
      });
    }
    const data =results.map(r => ({
      id: r._id.toString(),
      title: r.title,
      cuisine: r.cuisine,
      rating: r.rating,
      prep_time: r.prep_time,
      cook_time: r.cook_time,
      total_time: r.total_time,
      description: r.description,
      nutrients: r.nutrients,
      serves: r.serves
    }));
    res.json({ total:data.length,data });
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};
module.exports = { addRecipe, getRecipes, searchRecipes };
