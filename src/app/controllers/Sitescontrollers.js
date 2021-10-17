const products = require('../../models/products')
var db = require('../../config/db/database');

class SitesController {
    
    // [get] /product
    product(req, res, next) {
        // use lean to by pass permission from express
        products.find({}).lean()
            .then(Products => {
                res.render('products',{Products})
            })
            .catch(next);
        
    }
order(req, res) {
        res.render('order');
    }
    report(req, res) {
        res.render('reports');
    }
    home(req, res) {
        res.render('home');
    }
}

module.exports = new SitesController();
