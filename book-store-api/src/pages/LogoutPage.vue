<script setup>

    import { onBeforeMount } from 'vue';
    import { useGlobalStore } from '../stores/global';
    import { useRouter } from 'vue-router';

    const { getUserDetails } = useGlobalStore();

    const router = useRouter();



    onBeforeMount(() => {

        // This clear() method removes all key-value pairs inside the localStorage.
        localStorage.clear();

        // After a user has logged out, set the user.email state back to null.
        getUserDetails(null);

        // Allows us to redirect user back to Login Page.
        // window.location.href = "/login"

        // Then redirect the user back to the Login Page.
        router.push({path: "/login"})

    })

</script>
