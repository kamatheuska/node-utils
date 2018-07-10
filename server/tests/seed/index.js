const { Product } = require('../../models/Product')

const seedProducts = [
  {
    'title': 'APARADOR DANES MARRON AMARILLO AZUL ROJO CHAPEADO',
    'model': 10002999,
    'description': 'APARADOR DANES MARRON . CHAPEADO EN PALISANDRO CON CAJA DE ESPEJO  60S . H. 114   A. 41  L. 200 CM.',
    'rates': {
      'pvp': {
        'unit': 1700
      }
    },
    'setup': {
      'keywords': 'APARADOR MARRON'
    },
    'specs': {
      'amount': {
        'collection': {
          'isCollection': false
        },
        'units': 1
      },
      'color': 'MARRON'
    }
  },
  {
    'title': 'APARADOR DANES TEKA',
    'model': 10003888,
    'description': 'APARADOR DANES TEKA MARRON AMARILLO AZUL ROJO MARRON FABRICADO POR  RT MOBEL. L.226 H. 86 A. 44 CM.',
    'rates': {
      'pvp': {
        'unit': 2600
      }
    },
    'setup': {
      'keywords': 'APARADOR MARRON'
    },
    'specs': {
      'amount': {
        'collection': {
          'isCollection': false
        },
        'units': 1
      },
      'color': 'MARRON'
    }
  },
  {
    'title': 'APARADORES SET 2 UND. EN',
    'model': 10006777,
    'description': 'APARADORES SET 2 UND.  EN MADERA  DE PALISANDRO  MARRON AMARILLO AZUL ROJO .  60S H. 53 L. 100  A. 50 CM.',
    'rates': {
      'pvp': {
        'unit': 1900
      }
    },
    'setup': {
      'keywords': 'APARADORES MARRON'
    },
    'specs': {
      'amount': {
        'collection': {
          'isCollection': false
        },
        'units': 1
      },
      'color': 'MARRON'
    }
  }
]

const populateProducts = (done) => {
  Product.remove({})
    .then(() => {
      Product.insertMany(seedProducts)
    })
    .then(() => done())
    .catch((err) => done(err))
}

const removeProducts = (done) => {
  Product.remove({})
    .then(() => {
      return Product.find({})
    })
    .then((data) => {
      console.log(data)
    })
    .then(() => done())
    .catch((err) => done(err))
}

module.exports = {
  populateProducts,
  removeProducts,
  seedProducts
}
