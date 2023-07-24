export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const validEmailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
let error = null;
export const validateEmail = (value) => {
    !validEmailRegex.test(value) ? (error = "Please enter a valid email address") : error = null;
    return error;
};

