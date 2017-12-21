/**
 * Created by Harrison on 05/12/2017.
 * describes routes for the application
 */

var app = require('../index').app;

var _ProductController = require('skaffold-ecommerce').ProductController;

var _UserController = require('skaffold-ecommerce').UserController;

var _CartController = require('skaffold-ecommerce').CartController;

var _CategoryController = require('skaffold-ecommerce').CategoryController;

var _productController = new _ProductController();
var _userController = new _UserController();
var _cartController = new _CartController();
var _categoryController = new _CategoryController();
var authenticationService = require('../index').authenticationService;


app.get('/', isLoggedIn, function (request, response) {
    console.log(request.user);
    return response.send("Welcome to your new scaffolded app. <3");
});



//product apis
app.post('/api/product/save', isLoggedIn, function (request, response) {
  return _productController.saveProduct(request, response);
});

app.get('/api/products', isLoggedIn, function (request, response) {
  return _productController.findProducts(request, response);
});

app.get('/api/product/find', isLoggedIn, function (request, response) {
  return _productController.findProductById(request, response);
});

app.put('/api/product/update', isLoggedIn, function (request, response) {
  return _productController.updateProduct(request, response);
});

app.delete('/api/product/delete', isLoggedIn, function (request, response) {
  return _productController.deleteProduct(request, response);
});

//category apis
app.post('/api/category/save', isLoggedIn, function (request, response) {
    return _categoryController.saveCategory(request, response);
});

app.get('/api/categories', isLoggedIn, function(request, response) {
    return _categoryController.findCategories(request, response);
});

app.get('/api/category/find', isLoggedIn, function (request, response) {
    return _categoryController.findCategoryById(request, response);
});

app.put('/api/category/update', isLoggedIn, function (request, response) {
    return _categoryController.updateCategory(request, response);
});

app.delete('/api/category/delete', isLoggedIn, function (request, response) {
    return _categoryController.deleteCategory(request, response);
});

//cart apis
app.get('/api/cart', isLoggedIn, function (request, response) {
  return _cartController.getCart(request, response);
});

app.post('/api/cart/add', isLoggedIn, function (request, response) {
  return _cartController.addItemToCart(request, response);
});

app.delete('/api/cart/remove', isLoggedIn, function (request, response) {
  return _cartController.removeItemFromCart(request, response);
});

//user apis
app.post('/api/user/save', isLoggedIn, function (request, response) {
  return _userController.registerUser(request, response);
});

app.get('/api/users', isLoggedIn, function (request, response) {
  return _userController.findUsers(request, response);
});

app.get('/api/user/find', isLoggedIn, function (request, response) {
  return _userController.findUserById(request, response);
});

app.put('/api/user/update', isLoggedIn, function (response, request) {
  return _userController.updateUser(request, response);
});

app.delete('/api/user/delete', isLoggedIn, function (request, response) {
  return _userController.deleteUser(request, response);
});

app.get('/login', function(request, response) {
    response.send('a login page should be created for this route. ;)');
});

app.post('/login', authenticationService._passport.authenticate('local', authenticationService._behaviour), function (request, response) {
    response.send(request.user.profile);
});

app.get('/user', isLoggedIn, function(req, res){
    res.send(req.user);
});

function isLoggedIn(request, response, next) {
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect('/login');
}