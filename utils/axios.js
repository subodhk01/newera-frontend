import axios from 'axios'
import cookie from 'react-cookies'

const debug = false
export const baseURL = debug ? "http://localhost:8000/" : 'https://newera-backend.herokuapp.com/'
//const baseURL = debug ? "http://localhost:8000/" : 'http://materate-math-a-hack-results.ap-south-1.elasticbeanstalk.com/'

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Authorization': cookie.load('access_token') ? "Bearer " +  cookie.load('access_token') : "",
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.log("error at interceptor: ", error)
        console.log("refresh_token: ", cookie.load('refresh_token'))
        console.log("access_token: ", cookie.load('access_token'))
        console.log(error.response)
        const originalRequest = error.config;

        // Prevent infinite loops
        if ( error.response && error.response.status === 401 && originalRequest.url === baseURL + 'token/refresh/') {
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        if( 
            error.response &&
            error.response.status === 401 && 
            error.response.data.code === "token_not_valid" &&
            error.response.statusText === "Unauthorized"
        ) {
                const refreshToken = cookie.load('refresh_token');

                if (refreshToken){
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                    // exp date in token is expressed in seconds, while now() returns milliseconds:
                    const now = Math.ceil(Date.now() / 1000);
                    console.log(tokenParts.exp);

                    if (tokenParts.exp > now) {
                        return axiosInstance
                        .post('/token/refresh/', {refresh: refreshToken})
                        .then((response) => {
            
                            cookie.save('access_token', response.data.access)
                            cookie.save('access_refresh', response.data.refresh)
                            axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.access;
                            originalRequest.headers['Authorization'] = "Bearer " + response.data.access;
            
                            return axiosInstance(originalRequest);
                        })
                        .catch(err => {
                            console.log(err)
                        });
                    }else{
                        console.log("Refresh token is expired", tokenParts.exp, now);
                        window.location.href = '/login/';
                    }
                }else{
                    console.log("Refresh token not available.")
                    window.location.href = '/login/';
                }
        }
      
     
      // specific error handling done elsewhere
      return Promise.reject(error);
  }
);

export { axiosInstance }