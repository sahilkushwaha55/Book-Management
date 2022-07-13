
const bookModel = require("../models/bookModel");
const reviewModel = require('../models/reviewModel')
const validator = require("../validations/validator");
const userModel = require("../models/userModel");
const { isValid, isValidBody, isValidObjectId, isValidTitle, isValidISBN, isValidReview, isValidDate } = validator;



const createBook = async function (req, res) {
    try {
        let data = req.body;
        if(Object.keys(data).length==0) return res.status(400).send({ Status: false, message: "no Book Details Entered" });

        let { title, excerpt, userId, ISBN, category, subCategory, releasedAt,reviews} = data;

        if (!isValid(title))return res.status(400).send({ Status: false, message: "Title Is Required" });
        if (!isValidTitle(title))return res.status(400).send({ Status: false, message: "Title Is Invalid" });
        
        let findOneTitle = await bookModel.findOne({ title: title });
        if (findOneTitle)return res.status(400).send({ Status: false, message: "Title Is Already Exists" });

        
        if (!isValid(excerpt))return res.status(400).send({ Status: false, message: "Excerpt Is Required" });
        //if (!isValidBody(excerpt))return res.status(400).send({ Status: false, message: "Excerpt Is Invalid" });
      
       
        if (!isValid(userId))return res.status(400).send({ Status: false, message: "UserId Is Required" });
        if (!isValidObjectId(userId))return res.status(400).send({ Status: false, message: "UserId Is Invalid"});

        let find=await userModel.findById(data.userId)
        if(!find) return res.status(404).send({status:false,message:"pleas check given user id"})
        
        
        if (!isValid(ISBN))return res.status(400).send({ Status: false, message: "ISBN Is Required" });
        if (!isValidISBN(ISBN)) return res.status(400).send({ Status: false, message: "ISBN Is Invalid" });

        let findOneISBN = await bookModel.findOne({ ISBN: ISBN });
        if (findOneISBN)return res.status(400).send({ Status: false, message: "ISBN Is Already Exists" });
        

        if (!isValid(category))return res.status(400).send({ Status: false, message: "Category Is Required" });
        if (!isValidBody(category))return res.status(400).send({ Status: false, message: "Category Is Invalid" });
        

        if (!isValid(subCategory))return res.status(400).send({ Status: false, message: "subCategory Is Required" });
        if (!isValidBody(subCategory))return res.status(400).send({ Status: false, message: "subCategory Is Invalid" });
        
            
        if("reviews"in data){
        if (!isValid(reviews))return res.status(400).send({ Status: false, message: "Reviews Is Required" });
        //if (!isValidReview(reviews))return res.status(400).send({ Status: false, message: "Reviews Is Invalid" });
        }

        if (!isValid(releasedAt)) return res.status(400).send({ Status: false, message: "ReleasedAt Is Required" });
        if (!isValidDate(releasedAt))return res.status(400).send({ Status: false, message: "ReleasedAt Is Invalid" });

        let findUserId = await userModel.findOne({ _id: userId });
        if (!findUserId)return res.status(404).send({ Status: false, message: "UserId Is Not Found" });

        let book = await bookModel.create(data);
        return res.status(201).send({ Status: true, message: "Success", data: book });
    }
    catch (err) {
        res.status(500).send({ Staus: false, message: err.message });
    }

}



const getAllBooks = async function (req, res) {

    try {
        let { category, userId, subCategory } = req.query
       
        let getFilter = Object.keys(req.query)
        
        if(getFilter.length){
        for(let value of getFilter){
            if(['category', 'userId', 'subCategory'].indexOf(value)==-1)
            return res.status(400).send({status: false, message: `You can't filter Using '${value}' `})
         }
        }
        
        req.query.isDeleted=false

        if("userId" in req.query){
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: `Plese enter valid user id.` })
        let checkUser = await userModel.findById(userId)
        if (!checkUser) return res.status(404).send({ status: false, message: "UserId Not Found" })
        }

        if ("category" in req.query) {
            if (category.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left Category Query Empty" })
        }
  
        if ("subCategory" in req.query) {
            if (subCategory.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left subCategory Query Empty" })
            subCategory =  subCategory.trim().split(",").map(e => e.trim())  
        }
      
        let data = await bookModel.find(req.query).select({ title: 1, excerpt:1,userId:1,category:1, releasedAt:1, reviews:1}).sort({ title: 1 });
        if (!data.length) return res.status(404).send({ status: false, message: "Book Not Found" })

        return res.status(200).send({ status: true, message: "Book List", data:data })
    
      } catch (err) {
        res.status(500).send({ status: false, error: err.message })
     }
     }




const getBookById = async function (req, res) {
    try {

        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: `BookId Should  Be Present` })
        if(!isValid(bookId)) return res.status(400).send({status:false,message:"bookId can;t be blanked"})
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId." })

        let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBook) return res.status(404).send({ status: false, message: "BookId Not Found" })

        const getReviewsData = await reviewModel.find({ bookId: checkBook._id, isDeleted: false }).select({ deletedAt: 0, isDeleted:0 , createdAt: 0, __v: 0, updatedAt: 0 })
       
        let { _id, title, excerpt, userId ,category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt} = checkBook
        let reviewsData = getReviewsData
        let result = { _id, title, excerpt, userId ,category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt , reviewsData}

         return res.status(200).send({ status: true, message: "Books List", data: result })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




const updateBook = async function (req, res) {
    try {

        const bookId = req.params.bookId
        const data = req.body
        
     
        if (Object.keys(data).length == 0) return res.status(400).send({ status: "false", message: "Pls Enter Some Data To be updated in body" })
        
        if ("title" in data){
            data.title=data.title.trim()
        if (!isValid(data.title)) return res.status(400).send({ status: false, message: "Title Value Should Not Be Blank" })
        if (!isValidTitle(data.title)) return res.status(400).send({ status: false, message: "Title Is Invalid" })
        
        const checkTitle = await bookModel.findOne({ title: data.title, isDeleted: false })
        if (checkTitle) return res.status(400).send({ status: false, message: `${data.title} is already exists.Please add a new title.` })
        }
     
        if("excerpt" in data){
        if (!isValid(data.excerpt)) return res.status(400).send({ status: false, message: `Excerpt Value Should Not Be Blank` })
         }
         
         if ("ISBN" in data) {
            data.ISBN=data.ISBN.trim()
        if (!isValid(data.ISBN)) return res.status(400).send({ status: false, message: `ISBN Value Should Not Be Blank` })
            if (!isValidISBN(data.ISBN)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid ISBN(ISBN should be 13 digit)' })
            }

            const checkIsbn = await bookModel.findOne({ ISBN: data.ISBN, isDeleted: false })
            if (checkIsbn) return res.status(400).send({ status: false, message: `${data.ISBN} is already registered,Please add a New.` })
        }

        if("releasedAt" in data){
            data.releasedAt=data.releasedAt.trim()
        if (!isValid(data.releasedAt)) return res.status(400).send({ status: false, message: `ReleasedAt Value Should Not Be Blank` })
        if (!isValidDate(data.releasedAt)) 
                return res.status(400).send({ status: false, message: 'Please provide a valid Date(YYYY-MM-DD)' })   
        }

        const updateBookData = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { title: data.title, excerpt: data.excerpt, releasedAt: data.releasedAt, ISBN: data.ISBN },
            { new: true })

       return res.status(200).send({ status: true, message: "Success", data: updateBookData })

    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if(!bookId) return res.status(400).send({status:false,message:"no id given"})
        if (!isValid(bookId)) return res.status(400).send({ status: false, message: 'please Enter The Book Id ' });
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: `invalid book Id` })

        let deletedBook = await bookModel.findOneAndUpdate({ $and: [{ _id: bookId }, { isDeleted: false }] }, {$set:{ isDeleted: true }})
        if (!deletedBook) return res.status(404).send({ status: false, message: `no Such Book In The Database` })

        return res.status(200).send({ status: true, message: "book Deleted Successfully" })
    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })
    }
}




module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBookById }