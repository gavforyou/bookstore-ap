<script setup>

    //import global stores, which contains our global states.
    import { useGlobalStore } from '../stores/global';
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';

    //import the axios method from axios library to allow sending HTTP requests to our server
    // import axios from 'axios';

    // import the axios api instance that we created in api.js 
    import api from '../api';

    //import useRouter from vue-router to import our router and be able to access it's redirecting methods instead of changing the page via href to force a page refresh.
    import { useRouter } from 'vue-router';

    //useRouter() returns our configurated router as an object with different methods for page navigation.
    const router = useRouter()

    //destructure the object returned by useGlobalStore() and get only the getUserDetails() to allow us to update our global state.
    const {getUserDetails, user} = useGlobalStore();

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    //update handleSubmit as an async function so we can use await inside it.
    async function handleSubmit(e){

        //e - the event object passed into the function
        //e.preventDefault() method disables the default behavior of submit event which refreshes the page upon submission.
        e.preventDefault();

        try {

            //Use axios() to create an HTTP request to our server at localhost:4000.
            //axios() method receives an object as argument which contains the details needed for an HTTP request.
            //method property contains the HTTP method of the request.
            //url contains the url and endpoint to access the resource in the server
            //data contains an object which is the request body.
            //The properties of data should reflect the structure of the request body needed in the server.
            //We use await to receive the response as an object because axios() returns a Promise.
            // let res = await axios({
            //     method: 'post',
            //     url: 'http://localhost:4000/users/login',
            //     data: {
            //         email: email.value,
            //         password: password.value
            //     }
            // })

            let res = await api.post('/users/login', {
                email: email.value,
                password: password.value
            })

            //One of the differences of vanilla JS's fetch() and axios() is that axios returns the response as object already. It already parses the incoming json as an object to be readily processed in our application.
            console.log(res)

            //res.data contains the message sent from res.send() in your ExpressJS API
            //For the login route, it returns a boolean.
            //We can access this boolean from the response object and use it as a condition to proceed.
            if(res.data.access){
                
                notyf.success("Login Successful");

                /*...*/
                // Data is saved as JSON in the localStorage. So later on, when we retrieve objects or other data types from it, we may have to parse it first.
                // localStorage.setItem("email",email.value);

                //res.data contains the object returned from our api, so to get the token we have to access the access property of the res.data object.
                //save the token from the login to be able to access it later.
                localStorage.setItem("token",res.data.access);

                //Pass the current value of our email input state and update the global state with its action method.
                // getUserDetails(email.value)

                //Update the Global State with its action method.
                //Pass the token retrieved from our API. Using the updated getUserDetails action, we will update the global user state details using details from the API.
                //We will update the getUserDetails global action to instead send a request to the server and get the user's details using the token from the login.
                getUserDetails(res.data.access);

                email.value = "";
                password.value = "";

                //window.location.reload() is a JS function that will allow us to reload the page. We will do this temporarily because we cannot yet trigger a re-render in the Navbar Component.
                // window.location.reload()

                //.push() is a router method that receives an object as an argument. It's property is called path, which contains the endpoint of the page we want to redirect the user to.
                //It redirects the user to the desired page without refreshing the app.
                router.push({path: '/books'})
            }
        } catch(e) {

            // Add a check to see if the error is a 404, 401, or 400 status code.
            // If it is, use the notyf.error() method and pass the error message to notify the user of the failed login.
            // These status codes are defined in the our backend API. Any other error code will be considered an unexpected error. 
            if(
                e.response.status === 404 || 
                e.response.status === 401 || 
                e.response.status === 400
            ){
                // Display the error message defined in our backend.
                notyf.error(e.response.data.message);
            } else {
                // a catch-all error message to catch any errors other than the ones above. 
                console.error(e);
                notyf.error("Login Failed. Please contact administrator.");
            }

        }
    }

    // Update the onBeforeMount
    onBeforeMount(() => {
        // use the user token to check if the user is already logged in and redirect to books page
        if(user.token){
            router.push({path: '/books'})
        }
    })

    
</script>

<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="emailInput" v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" v-model="password" />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Login</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
