function ParseDB (collection) {
  this.collection = collection
  this.dictionary = []
}

ParseDB.prototype.getCountDictionary = function () {
  let resultStr = ''
  this.collection
    .map((doc) => doc.description)
    .join(' ')
    .split(' ')
    .filter((word) => word.length > 2)
    .forEach((word) => {
      if (resultStr.indexOf(word) === -1) {
        resultStr += word + ' '
        this.dictionary.push({
          count: 1,
          word
        })
      } else {
        this.dictionary.forEach((entry) => {
          if (entry.word === word) {
            entry.count += 1
          }
        })
      }
    })
  return this.dictionary
}

module.exports = ParseDB
