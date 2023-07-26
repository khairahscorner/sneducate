export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const validEmailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
let error = null;
export const validateEmail = (value) => {
    !validEmailRegex.test(value) ? (error = "Please enter a valid email address") : error = null;
    return error;
};

export const schoolTerms = [
    { term: 1, start: "September", end: "December" },
    { term: 2, start: "January", end: "April" },
    { term: 3, start: "May", end: "July" }
]

export const getShortCode = (str) => {
    const words = str.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase()).join('');
}