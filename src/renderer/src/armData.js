import axios from 'axios'

const armData = {
  getData: () => {
    return new Promise((resolve, reject) => {
      axios.get('http://localhost:4000/arm/data/ak60')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        });
    })
  },
}

export { armData }
