import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function useAPICall() {
    const APIResponse = ref(null);
    const HTTPResponseCode = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const APICall = async ({ endpoint, APIParameters = {}, method = 'POST', headers = {} }) => {
        loading.value = true;
        error.value = null;

        // Set CSRF Cookie before attempting any API calls
        //
        const setCsrfCookie = async () => {
            try {
                await axios.get(`${process.env.VUE_APP_CLIENTSDB_URL}/sanctum/csrf-cookie`);
            } catch (csrfError) {
                console.error('Failed to set CSRF cookie:', csrfError);
                throw csrfError;
            }
        };

        try {
            await setCsrfCookie();

            // Fetch the CSRF token from cookies
            const xsrfToken = Cookies.get('XSRF-TOKEN');

            const response = await axios({
                method: method,
                url: `${process.env.VUE_APP_CLIENTSDB_API_URL}${endpoint}`,
                data: APIParameters,
                headers: headers, 'X-XSRF-TOKEN': xsrfToken
            });
            APIResponse.value = response.data;
            HTTPResponseCode.value = response.status;
        } catch (err) {
            error.value = err;
            if (err.response) {
                HTTPResponseCode.value = err.response.status;
                APIResponse.value = err.response.data;
            }
        } finally {
            loading.value = false;
        }

    };

    return {
        APIResponse,
        HTTPResponseCode,
        APICall,
        loading,
        error
    };
}
