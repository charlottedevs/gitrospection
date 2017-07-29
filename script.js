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

  Object.keys(totals).map(k => {
    totals[k] = Number(totals[k] / totalBytes).toFixed(4)
  })

  return totals
}

const transformData = totals => {
  return {
    datasets: [{
      data: Object.values(totals),
      label: 'Programming Languages',
      backgroundColor: [
        'rgba(112, 21, 22, 0.2)', // ruby
        'rgba(227, 76, 38, 0.2)', // html
        'rgba(241, 224, 90, 0.2)', // js
        'rgba(86, 61, 124, 0.2)', // css
        'rgba(137, 224, 81, 0.2)', // shell
        'rgba(36, 71, 118, 0.2)' // coffeescript
      ],
    }],
    labels: Object.keys(totals)
  }
}

const updateChart = data => {
  console.log(data)
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {}
});
}

const reposUrl = 'https://api.github.com/users/%USER%/repos?type=owner'

function getUserData(url) {
  fetch(url)
    .then(response => response.json())
    .then(fetchLanguages)
    .then(calculateTotals)
    .then(calculatePercentages)
    .then(transformData)
    .then(updateChart)
    .catch(e => console.log(e));
}

$(document).ready(function() {
  $('#github-user').bind('keyup', function(event) {
    if (event.keyCode === 13) {
      $('#github-submit').click();
    }
  });

  $('#github-submit').click(function() {
    let userReposUrl = reposUrl.replace('%USER%', $(this).val());
    getUserData(userReposUrl);
  });
});
