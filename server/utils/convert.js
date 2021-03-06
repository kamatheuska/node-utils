const parse = require('csv-parse/lib/sync')
const { colors } = require('./dictionary')

function Convert () {
  this.keywords = []

  this.mapDbModel = (obj) => {
    let arr = obj.NOMBRE.split(' ')
    let colorMatches = getMatches(obj.NOMBRE, colors)
    let keywords = `${arr[0]} ${colorMatches}`

    this.keywords.push(keywords)

    return {
      title: arr.slice(0, 5).join(' ').trim(),
      model: obj.MODELO,
      description: obj.NOMBRE,
      rates: {
        pvp: {
          unit: obj.PRECIO
          // collection: 0
        }
        // cost: 0
      },
      setup: { keywords },
      specs: {
        amount: {
          collection: {
            isCollection: false
            // units: 0
          },
          units: obj['STOCK TOTAL']
        },
        // designer: {
        //   id: 0,
        //   notes: '',
        //   name: '',
        //   origin: ''
        // },
        // manufacturer: {
        //   id: 0,
        //   name: '',
        //   origin: ''
        // },
        // measures: {
        //   weight: 0,
        //   height: 0,
        //   long: 0,
        //   width: 0
        // },
        // year: 0,
        color: colorMatches
        // odor: '',
        // country: '',
        // material: '',
      },
      created: Date.now()
    }
  }

  const getMatches = (str, reference) => {
    let result = []
    for (let i = 0; i < reference.spa.length; i++) {
      if (str.indexOf(reference.spa[i]) !== -1) {
        result.push(reference.spa[i])
      }
    }
    for (let i = 0; i < reference.eng.length; i++) {
      if (str.indexOf(reference.eng[i]) !== -1) {
        result.push(reference.eng[i])
      }
    }
    return result.length === 0 ? null : result.join(' ')
  }
}

Convert.prototype.formatCsv = function (csv) {
  let records = csv.trim().toUpperCase()
  let rawCollection = parse(records, {
    cast: true,
    columns: true
  })
  return {
    collection: rawCollection.map(this.mapDbModel),
    keywords: this.keywords.join(' ').split(' ').reduce((resultStr, word) => {
      if (resultStr.indexOf(word) === -1) {
        resultStr += word + ' '
        return resultStr
      }
      return resultStr
    }, '')
  }
}

Convert.prototype.generateCsv = function (arr) {
  let headers = Object.keys(arr[0]).split(',')
  return `${headers}`
}

module.exports = Convert
