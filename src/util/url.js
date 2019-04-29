export const hostname = url => {
  var a = document.createElement('a')
  a.href = url
  return a.hostname
}
