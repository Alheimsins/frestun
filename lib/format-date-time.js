module.exports = date => {
  return date ? new Date(date).toLocaleString() : 'unknown'
}
