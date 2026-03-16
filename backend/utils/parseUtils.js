function parseNumber(value) {
  if (value===null||value===undefined) return null;
  if (typeof value==='string') {
    value=value.trim();
    if (value==='') return null;
  }
  const num=Number(value);
  return Number.isNaN(num) ? null : num;
}
module.exports={ parseNumber };
