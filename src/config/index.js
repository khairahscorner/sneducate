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

export const maxStaffCount = 20;

export const starFrameworks = [
    { label: "3-Star", val: 3 },
]

export const schoolTerms = [
    { label: "First", val: "first" },
    { label: "Second", val: "second" },
    { label: "Third", val: "third" },
]

export const privateTerms = [
    { label: "Quarterly", val: "quarterly" },
    { label: "Bi-annually", val: "bi-annually" }
]

export const schoolYears = () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];

    for (let i = 0; i <= 3; i++) {
        const startYear = currentYear + i;
        const endYear = startYear + 1;
        yearOptions.push(`${startYear}/${endYear}`);
    }

    return yearOptions;
}

export const generateTermOptions = (value) => {
    return value === 'quarterly' ? ['First Quarter', 'Second Quarter', 'Third Quarter'] : ['First Half', 'Second Half'];
}

export const getShortCode = (str) => {
    const words = str.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase()).join('');
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const customStyles = {
    overlay: {
        backgroundColor: "rgba(100, 100, 100, 0.5)",
        zIndex: 100,
    },
    content: {
        background: "#ffffff",
        border: "1px solid transparent",
        borderRadius: "4px",
        padding: "0 20px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "50%",
        height: "80vh", // Limit the height to maintain visibility on smaller screens
    },
};