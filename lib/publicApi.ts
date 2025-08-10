import axios from "axios";

const publicApi = axios.create({
    baseURL : "https://demo-ecom-back-end.onrender.com",
    headers: {
        'Content-Type' : 'application/json'
    }
})

export default publicApi