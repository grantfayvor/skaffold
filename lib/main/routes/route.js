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

app.get('/', function (request, response) {
    return response.send("Welcome to your new scaffolded app. <3");
});



//product apis
app.post('/api/product/save', function (request, response) {
  return _productController.saveProduct(request, response);
});

app.get('/api/products', function (request, response) {
  return _productController.findProducts(request, response);
});

app.get('/api/product/find', function (request, response) {
  return _productController.findProductById(request, response);
});

app.put('/api/product/update', function (request, response) {
  return _productController.updateProduct(request, response);
});

app.delete('/api/product/delete', function (request, response) {
  return _productController.deleteProduct(request, response);
});

//category apis
app.post('/api/category/save', function (request, response) {
    return _categoryController.saveCategory(request, response);
});

app.get('/api/categories', function(request, response) {
    return _categoryController.findCategories(request, response);
});

app.get('/api/category/find', function (request, response) {
    return _categoryController.findCategoryById(request, response);
});

app.put('/api/category/update', function (request, response) {
    return _categoryController.updateCategory(request, response);
});

app.delete('/api/category/delete', function (request, response) {
    return _categoryController.deleteCategory(request, response);
});

//cart apis
app.get('/api/cart', function (request, response) {
  return _cartController.getCart(request, response);
});

app.post('/api/cart/add', function (request, response) {
  return _cartController.addItemToCart(request, response);
});

app.delete('/api/cart/remove', function (request, response) {
  return _cartController.removeItemFromCart(request, response);
});

//user apis
app.post('/api/user/save', function (request, response) {
  return _userController.registerUser(request, response);
});

app.get('/api/users', function (request, response) {
  return _userController.findUsers(request, response);
});

app.get('/api/user/find', function (request, response) {
  return _userController.findUserById(request, response);
});

app.put('/api/user/update', function (response, request) {
  return _userController.updateUser(request, response);
});

app.delete('/api/user/delete', function (request, response) {
  return _userController.deleteUser(request, response);
});