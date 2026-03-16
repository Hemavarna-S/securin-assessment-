const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Recipe = require('../models/Recipe');
const { parseNumber } = require('../utils/parseUtils');
connectDB();
const dataPath = path.resolve(__dirname, '..', 'US_recipes_null.json');
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (err) {
  console.error('Failed to read or parse data file:', dataPath, err);
  process.exit(1);
}
function extractArray(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key])) return parsed[key];
    }
    const keys = Object.keys(parsed);
    if (keys.length && keys.every(k => /^\d+$/.test(k))) {
      return keys.sort((a, b) => Number(a) - Number(b)).map(k => parsed[k]);
    }
  }
  return null;
}
const records = extractArray(data);
if (!records) {
  console.error('Parsed JSON is not an array and contains no top-level array properties.');
  console.error('Top-level type:', typeof data, 'Top-level keys:', data && Object.keys(data));
  process.exit(1);
}
const doImport = process.argv.includes('--import') || process.env.FULL_IMPORT === '1';
async function importData() {
  try {
    const formattedData = records.map(item => ({
      cuisine: item.cuisine,
      title: item.title,
      rating: parseNumber(item.rating),
      prep_time: parseNumber(item.prep_time),
      cook_time: parseNumber(item.cook_time),
      total_time: parseNumber(item.total_time),
      description: item.description,
      nutrients: item.nutrients,
      serves: item.serves
    }));
    if (doImport) {
      await Recipe.insertMany(formattedData);
      console.log('Data imported successfully');
    } else {
      console.log('Dry-run: found', formattedData.length, 'records. Run with `--import` to insert.');
      console.log('Preview:', formattedData.slice(0, 3));
    }
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}
importData();
