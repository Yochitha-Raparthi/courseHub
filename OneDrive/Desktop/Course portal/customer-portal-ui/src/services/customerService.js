
// import axios from "axios";

// const API_URL = "http://localhost:9878/customer";

// export const getAllCustomers = () =>
//   axios.get(`${API_URL}/all`);

// export const createCustomer = (customer) =>
//   axios.post(`${API_URL}/create`, customer);

// export const updateCustomer = (id, customer) =>
//   axios.put(`${API_URL}/update/${id}`, customer);

// export const deleteCustomer = (id) =>
//   axios.delete(`${API_URL}/delete/${id}`);

// export const getCustomerById = (id) =>
//   axios.get(`${API_URL}/getCustomer/id/${id}`);

// export const getCustomerByEmail = (email) =>
//   axios.get(`${API_URL}/getCustomer/email/${encodeURIComponent(email)}`);


import axios from "axios";

const API_URL = "http://localhost:9878/customer";

export const getAllCustomers = () =>
  axios.get(`${API_URL}/all`);

export const createCustomer = (customer) =>
  axios.post(`${API_URL}/create`, customer);

export const getCustomerById = (id) =>
  axios.get(`${API_URL}/getCustomer/id/${id}`);

export const getCustomerByEmail = (email) =>
  axios.get(
    `${API_URL}/getCustomer/email/${encodeURIComponent(email)}`
  );

export const updateCustomer = (id, customer) =>
  axios.put(`${API_URL}/update/${id}`, customer);

export const deleteCustomer = (id) =>
  axios.delete(`${API_URL}/delete/${id}`);
