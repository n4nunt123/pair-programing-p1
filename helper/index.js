let listError = (error) => {
  return error.errors.map(el => el.message)
}

module.exports = {listError}