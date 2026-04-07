// Stores are defined using the defineStore() function and can be registered globally or locally within a component.
import { defineStore } from 'pinia';
import { reactive } from 'vue';
//import axios to send requests to our server when the action method is used.
// import axios from 'axios';
// import the axios api instance that we created in api.js 
import api from '../api';


// defineStore() creates a store. It has 2 arguments, the unique id of the store ('global') and the callback function that defines and returns the states and actions of the store.
// States and methods from a store can be accessed globally.
export const useGlobalStore = defineStore('global', () => {
    let user = reactive({
        token: localStorage.getItem('token'), // Add the token property and get token value from localStorage
        email: null,
        isAdmin: null,
        isLoading: false
    })


    // function getUserDetails(email) {
    //     // Pass the email value to the global user state.
    //     user.email = email;
    // }

    //getUserDetails() receives the user's email as an argument and updates our state's email property.
    //Retreive the user's details by passing its token.
    //if the route has auth.verify, or needs to pass header, we need to add a headers property.
    //Authorization is the header which contains our Bearer token.
    //res.data.access is our token from our successful login using axios.
    async function getUserDetails(token){
        
        // Check if the token is null, if it is, set the token, email, and isAdmin to null 
        // and return to terminate the function.
        if(!token) {
            user.token = null;
            user.email = null;
            user.isAdmin = null;

            return;
        }

        try {
            user.isLoading = true;
            // use api.get to make a GET request to the /users/details endpoint.
            let {data} = await api.get('/users/details');
            
            user.isLoading = false;

            //update the global user state with the token.
            user.token = token;
            //update the global user state with the user details.
            user.email = data.email;
            //We can now add detail whether the user logged in is an admin.
            user.isAdmin = data.isAdmin;
        } catch (error) {
            // If there's an error (e.g., invalid token), clear the user state
            console.error('Failed to get user details:', error);
            user.isLoading = false;
            user.token = null;
            user.email = null;
            user.isAdmin = null;
            localStorage.removeItem('token');
        }
    }

    // When useGlobalStore is passed and accessed in another component it gives access to the user state and the getUserDetails function.
    return {
        user,
        getUserDetails
    }

});
