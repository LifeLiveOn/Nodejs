const products = require('../../models/products')
var db = require('../../config/db/database');
const carts = require('../../models/cart');
var randomstring = require("randomstring");
var mongoose = require('mongoose');
const bills = require('../../models/bill');

class Admincontrollers{
    // [get] main menu path: /adminmanage
    index(req, res,next){
        // const check = req.session.isAuth;
        // console.log(check);
        res.redirect('/action/login');
        //res.render('admin/adminmenu');
    }
    //[get] /adminmanage/bills
    bills(req, res, next){
        carts.find({}).lean()
            .then(cartitem=>{
                res.render('admin/bills',{cartitem});
            })
            .catch(next);
        
    }
    // ghi chu can sua lai add to cart;
   async toCart(req, res, next){
    /// xai if else o day 
    // cart find id if(data) quantity +1, else product find(id) save product.
       const proid = req.params.id;
    await carts.countDocuments({_id:proid}).lean()
        .then(count=>{
            console.log(count)
                if(count>0){
                    carts.updateOne({_id:proid},{$inc:{quantity:1}}).lean().exec()
                    res.redirect('/adminmanage/bills/find?product_name=')
                }
                else{
                    products.find({_id: proid}).lean()
                        .then(data=>{
                    const cartData = data[0];
                    cartData.quantity = 1;
                    const cart = new carts(cartData);
                    cart.save();
                    res.redirect('/adminmanage/bills/find?product_name=')
                        })
                }   
            })
       
    }
    // show both search and cart 
    async search2(req, res, next){
        const Searchvalue = req.query.product_name;
        let regex = new RegExp(Searchvalue,'i');
        const data = await products.find({'product_name':regex}).lean().exec();
        const cartitem = await carts.find({}).lean().exec();
            res.render('admin/bills',{data,cartitem})
        }
    
    // /bills/find?product_name=
    search(req, res, next){
        const Searchvalue = req.query.product_name;
        let regex = new RegExp(Searchvalue,'i');
        products.find({'product_name':regex}).lean()
            .then(data=>{
                res.render('admin/bills',{data}) 
            })
            .catch(next);
    }
    //[get] /adminmanage/v show all products 
    view(req, res, next){
        products.find({}).lean()
            .then(data => {
                res.render('admin/viewall',{data})
            })
            .catch(next);
    }
    // [get] /adminmanage/edit/:id
    edit(req, res,next){
        products.findById(req.params.id).lean()
            // .then(products => res.json(products))
            .then(data =>{
                //res.json(Products)
                res.render('products/edit',{data})
            })
            .catch(next);

    }
    //[get]
    delete(req, res, next){
        products.findByIdAndRemove({_id:req.params.id}).lean()
            .then(()=> res.redirect('/adminmanage/v'))
            .catch(next);
    }
    //delete chosen item from a cart
    delcart(req, res, next){
        carts.remove({_id:req.params.id}).lean()
            .then(()=> res.redirect('/adminmanage/bills/find?product_name='))
            .catch(next);
    }
    //print out the bill and save it to database
    printbill(req, res, next){
        // const check = req.session.isAuth;
        // console.log(check);
        // console.log((req.body.object[0]))
        // res.send("wait");
        // const objectsData = req.body;
        console.log(req.body)
        const result = {};
        result.detail = req.body.object;
        result.quantity = req.body.quantity;
        result.price = req.body.total_price;
        result.date = new Date()
        // objectsData.detail = req.body.object;
        // objectsData.date = new Date();
        // objectsData.price = req.body.total_price
        const bill = new bills(result);
        bill.save()
            .then(() => res.redirect('/adminmanage/bills'))
            .catch(error =>{
            });
    }
    clear(req, res, next){
        carts.deleteMany({})
            .then(() => res.redirect('/adminmanage/bills'))            
    }
    updateqty(req, res, next){
        const newquantity = req.query.qty;
        const Id = req.query.id;
        res.send(req.query);
        carts.updateOne({_id:Id},{quantity:newquantity}).lean().exec();
        res.redirect('/adminmanage/bills/find?product_name=')
    }

}
module.exports = new Admincontrollers();