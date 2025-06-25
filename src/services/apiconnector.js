import axios from "axios"

export const axiosInstance = axios.create({});
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const apiConnector = (method, url, bodyData, headers, params) => {
    console.log("=== API CONNECTOR DEBUG ===");
    console.log("Method:", method);
    console.log("URL:", url);
    console.log("Full URL:", url.startsWith('http') ? url : `${BASE_URL}${url}`);
    console.log("Body Data:", bodyData);
    console.log("Headers:", headers);
    
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}