module.exports = item => {
  let color = 'red'
  let now = new Date().getTime()
  if (item.lastPostponed) {
    if (now - item.lastPostponed < item.limits.yellow) {
      color = 'green'
    } else if (now - item.lastPostponed < item.limits.orange) {
      color = 'yellow'
    } else if (now - item.lastPostponed < item.limits.red) {
      color = 'orange'
    } else if (now - item.lastPostponed > item.limits.red) {
      color = 'red'
    }
  }
  return color
}
