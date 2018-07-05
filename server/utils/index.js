const formatCsv = (csv) => {
  return csv
    .trim()
    .toUpperCase()
    .split('\n')
    .map((row, i) =>
      i === 0 ? row.split(',').map(el => el.replace(/\s/g, '_')).join(',') : row)
    .join('\n')
}

module.exports = { formatCsv }
