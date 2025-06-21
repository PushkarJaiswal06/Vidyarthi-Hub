import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    console.log("=== API CONNECTOR DEBUG ===");
    console.log("Method:", method);
    console.log("URL:", url);
    console.log("Full URL:", url.startsWith('http') ? url : `http://localhost:4000${url}`);
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