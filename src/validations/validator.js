const mongoose = require('mongoose')

const isValid = (value) => {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
   
    return true
}

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidTitle = (title) => {
    if (/^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/.test(title))
        return true
}

const isValidEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return true
}

const isValidBody = (body) => {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/.test(body))
        return true
}

const isValidAddress = (body) => {
    if (/^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/.test(body))
        return true
}

const isValidPassword = (pw) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/.test(pw))
        return true
}

const isValidName = (name) => {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name))
        return true
}


const isValidISBN = (isbn) => {
    if (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn))
        return true
}

const isValidReview = (review) => {
    if (/^[0-5]{1}$/.test(review))
        return true
}

const isValidDate = (date) => {
    if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
        return true
}


module.exports = { isValid, isValidBody, isValidObjectId, isValidTitle, isValidPassword, isValidName, isValidEmail, isValidISBN, isValidReview, isValidDate,isValidAddress }