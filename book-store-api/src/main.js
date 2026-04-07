// Imports from the bootstrap library
// This will allow us to use bootstrap in all components (universal)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

// Import the styling library of notyf to the whole project.
import 'notyf/notyf.min.css';


import { createApp } from 'vue'
import './style.css'
// Inject our global store into our main.js to allow all components to access our store.
import { createPinia } from 'pinia';
import App from './App.vue'

// Import the Page components here to setup the routing in your app.
import HomePage from './pages/HomePage.vue';
import BooksPage from './pages/BooksPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ErrorPage from './pages/ErrorPage.vue';
import ViewBook from './pages/ViewBook.vue';
import AddBook from './pages/AddBook.vue';
import CartPage from './pages/CartPage.vue';
import OrdersPage from './pages/OrdersPage.vue';


//  createWebHistory allows us to create a much cleaner router endpoints. It specefically remove the hash (#) symbol from our endpoint.
// createRouter creates the instance of route object which contains:
    // path - describes the endpoint of the URL page
    // name - property to describe the route. It can be used as reference for navigation using vue-router
    // component - tells which component to load when an endpoint resource is accessed.
import { createRouter, createWebHistory } from 'vue-router';




// Route Configuration using Vue-Router:

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/books',
            name: 'Books',
            component: BooksPage
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterPage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/logout',
            name: 'Logout',
            component: LogoutPage
        },
        {
            path: '/book/:id',
            component: ViewBook
        },
        {
            path: '/addBook',
            name: 'AddBook',
            component: AddBook
        },
        {
            path: '/cart',
            name: 'Cart',
            component: CartPage
        },
        {
            path: '/orders',
            name: 'Orders',
            component: OrdersPage
        },
        {
            path: '/:catchAll(.*)',
            component: ErrorPage
        } 
    ]
});




// Every vue.js application starts with creating a new application instance using the createApp() function from vue.
    // We pass the App.vue as "App" component into the createApp() method.
    // The App component is a "root" component that can contain other components as its child components.
    // The mount() method is used to render/inject the root component into the target element from the DOM by its id/id

const app = createApp(App);


// createPinia() is a library that will allow us to use and manage our Pinia stores in our app.
app.use(createPinia());

// app.use() will allows us to use global libraries to our Vue app such as this router.
app.use(router);

// Mount or render the app components into the HTML element.
app.mount('#app');
