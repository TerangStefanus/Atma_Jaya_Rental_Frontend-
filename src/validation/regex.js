const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape
const numberOnlyRegex = /^\d+(\.\d+)?$/ // eslint-disable-line no-useless-escape
const pdfRegex = /(\.pdf)$/i
const textOnlyRegex = /^[A-Za-z.,\s]+$/
const phoneNumberRegex =/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/g

export {
    emailRegex,
    numberOnlyRegex,
    pdfRegex,
    textOnlyRegex,
    phoneNumberRegex
}