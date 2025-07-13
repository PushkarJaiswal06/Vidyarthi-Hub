import axios from "axios"

console.log('REACT_APP_BASE_URL:', process.env.REACT_APP_BASE_URL);

export const axiosInstance = axios.create({});
const BASE_URL = process.env.REACT_APP_BASE_URL
  ? process.env.REACT_APP_BASE_URL
  : process.env.NODE_ENV === 'production'
    ? "https://api.vidyarthi-hub.xyz/api/v1"
    : "http://localhost:5000/api/v1";

export const apiConnector = (method, url, bodyData, headers, params) => {
    console.log("=== API CONNECTOR DEBUG ===");
    console.log("Method:", method);
    console.log("URL:", url);
    console.log("BASE_URL:", BASE_URL);
    
    // Construct the full URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log("Full URL:", fullUrl);
    console.log("Body Data:", bodyData);
    console.log("Headers:", headers);
    
    return axiosInstance({
        method:`${method}`,
        url: fullUrl,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}