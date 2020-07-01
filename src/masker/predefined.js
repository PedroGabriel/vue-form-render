const masks = {}

masks.cpf = {
  mask: '###.###.###-##',
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.cnpj = {
  mask: '##.###.###/####-##',
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.document = {
  mask: [masks.cpf.mask, masks.cnpj.mask],
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.creditcard = {
  mask: '#### #### #### ####',
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.date = {
  mask: '##/##/####',
  input_type: 'tel',
  init: value => date_from_iso(value),
  parser: value => date_to_iso(value)
}

masks.dateiso = {
  mask: '####-##-##',
  input_type: 'tel'
}

masks.datetime = {
  mask: '##/##/#### ##:##',
  input_type: 'tel',
  init: value => date_from_iso(value),
  parser: value => date_to_iso(value)
}

masks.day = {
  mask: '##',
  input_type: 'tel'
}

masks.month = {
  mask: '##',
  input_type: 'tel'
}

masks.year = {
  mask: '####',
  input_type: 'tel'
}

masks.time = {
  mask: '##:##',
  input_type: 'tel'
}

masks.timeseconds = {
  mask: '##:##:##',
  input_type: 'tel'
}

masks.celphone = {
  mask: '(##) #####-####',
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.landline = {
  mask: '(##) ####-####',
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.phone = {
  mask: ['(##) ####-####', '(##) #####-####'],
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.zipcode = {
  mask: '#####-###',
  input_type: 'tel',
  parser: value => numeric_only(value)
}

masks.carplate = {
  mask: 'AAA-AAAA',
  input_type: 'text',
  parser: value => numeric_only(value)
}

const numeric_only = str => str.replace(/\D+/g, '')

// 1994-08-24 to 24/08/1994
const date_from_iso = value => {
  let pieces = value.split(' ')
  let date = value
  let time = false
  if (pieces.length > 1) {
    time = pieces[1]
    date = pieces[0]
  }
  let exp = date.split('-')

  // FIX WRONG DATES CONVERTED WITH MASK PARSED BEFORE INIT
  if (
    exp.length == 3 &&
    !value.includes('-') &&
    (parseInt(exp[2]) > 31 ||
      parseInt(exp[1]) > 12 ||
      parseInt(exp[0]).toString().length != 4)
  ) {
    date = numeric_only(date)
    exp = [
      date[0] + date[1] + date[2] + date[3],
      date[4] + date[5],
      date[6] + date[7]
    ]
  }

  return `${exp[2]}/${exp[1]}/${exp[0]}` + (time ? ` ${time}` : '')
}

// 24/08/1994 to 1994-08-24
const date_to_iso = value => {
  if (value.includes('-')) return value
  let pieces = value.split(' ')
  let date = value
  let time = false
  if (pieces.length > 1) {
    time = pieces[1]
    date = pieces[0]
  }

  let exp = date.split('/')
  return `${exp[2]}-${exp[1]}-${exp[0]}` + (time ? ` ${time}` : '')
}

export default mask => (masks[mask] ? { id: mask, ...masks[mask] } : null)
