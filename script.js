const createNode = el => document.createElement(el);
const appendNode = (parent, el) => parent.appendChild(el);
const ul = document.getElementById('repos');


const fetchLanguages = json => {
  return json.map(repo => {
    return fetch(repo.languages_url)
      .then(response => response.json())
  })
}

const calculateTotals = languages => {
  let totals = {}

  return Promise.all(languages).then(values => {
    let nonUniqueKeys = values.map(obj => Object.keys(obj))
    let set = new Set(nonUniqueKeys.reduce((a, b) => a.concat(b)))
    let uniqLanguages = Array.from(set)


    values.map(obj => {
      Object.keys(obj).map(key => {
        totals[key] = totals[key] || 0
        totals[key] += obj[key]
      })
    })

    return totals
  })
}

const calculatePercentages = totals => {
  let totalBytes = Object.values(totals).reduce((sum, value) => sum + value)
  console.log('totalBytes: ' + totalBytes)

  Object.keys(totals).map(k => {
    totals[k] = Number(totals[k] / totalBytes).toFixed(4)
  })

  return totals
}

const appendStats = totals => {
  Object.keys(totals).map(k => {
    let li = createNode('li')

    li.innerHTML = `${k}: ${totals[k]}`
    appendNode(ul, li)
  })

  return totals
}


const reposUrl = 'https://api.github.com/users/binarymason/repos?type=owner'
fetch(reposUrl)
  .then(response => response.json())
  .then(fetchLanguages)
  .then(calculateTotals)
  .then(calculatePercentages)
  .then(appendStats)
  .catch(e => console.log(e))
