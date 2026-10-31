export const validateName = (name) => name.length >= 20 && name.length <= 60;
export const validateAddress = (address) => address.length <= 400;
export const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    return regex.test(password);
};
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
