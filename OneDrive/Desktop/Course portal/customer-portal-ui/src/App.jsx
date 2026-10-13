// import { useEffect, useState } from "react";
// import {
//   getAllCustomers,
//   createCustomer,
//   getCustomerById,
//   getCustomerByEmail,
//   updateCustomer,
//   deleteCustomer,
// } from "./services/customerService";
// import "./App.css";

// const emptyForm = {
//   name: "",
//   phone: "",
//   email: "",
//   city: "",
//   state: "",
// };

// function App() {
//   const [customers, setCustomers] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);
//   const [searchId, setSearchId] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let ignore = false;

//     async function fetchCustomers() {
//       try {
//         const response = await getAllCustomers();
//         if (!ignore) setCustomers(response.data);
//       } catch (err) {
//         if (!ignore) {
//           setError(
//             err.response?.data?.message ||
//               "Unable to load customers. Check your backend."
//           );
//         }
//       }
//     }

//     fetchCustomers();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   function showError(err, fallback) {
//     setError(
//       err.response?.data?.message ||
//         err.response?.data ||
//         fallback
//     );
//   }

//   async function loadCustomers() {
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await getAllCustomers();
//       setCustomers(response.data);
//     } catch (err) {
//       showError(err, "Unable to load customers.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleChange(event) {
//     const { name, value } = event.target;
//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setSaving(true);
//     setError("");
//     setMessage("");

//     const customer = {
//       ...form,
//       phone:
//         form.phone.trim() === ""
//           ? null
//           : Number(form.phone),
//     };

//     try {
//       if (editingId !== null) {
//         await updateCustomer(editingId, customer);
//         setMessage("Customer updated successfully.");
//       } else {
//         await createCustomer(customer);
//         setMessage("Customer created successfully.");
//       }

//       setForm(emptyForm);
//       setEditingId(null);
//       await loadCustomers();
//     } catch (err) {
//       showError(err, "Unable to save customer.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   function handleEdit(customer) {
//     setForm({
//       name: customer.name ?? "",
//       phone: customer.phone == null ? "" : String(customer.phone),
//       email: customer.email ?? "",
//       city: customer.city ?? "",
//       state: customer.state ?? "",
//     });

//     setEditingId(customer.id);
//     setMessage("");
//     setError("");

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   function handleCancel() {
//     setForm(emptyForm);
//     setEditingId(null);
//     setMessage("");
//     setError("");
//   }

//   async function handleDelete(customer) {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${customer.name} (ID: ${customer.id})?`
//       )
//     ) {
//       return;
//     }

//     setError("");
//     setMessage("");

//     try {
//       await deleteCustomer(customer.id);

//       if (editingId === customer.id) {
//         handleCancel();
//       }

//       setMessage(`Customer ${customer.id} deleted successfully.`);
//       await loadCustomers();
//     } catch (err) {
//       showError(err, "Unable to delete customer.");
//     }
//   }

//   async function handleSearch(event, type) {
//     event.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     const value =
//       type === "id" ? searchId.trim() : searchEmail.trim();

//     if (!value) {
//       setLoading(false);
//       setError(
//         type === "id"
//           ? "Enter a customer ID."
//           : "Enter a customer email."
//       );
//       return;
//     }

//     if (type === "id" && !/^\d+$/.test(value)) {
//       setLoading(false);
//       setError("Customer ID must be a positive number.");
//       return;
//     }

//     try {
//       const response =
//         type === "id"
//           ? await getCustomerById(value)
//           : await getCustomerByEmail(value);

//       if (!response.data) {
//         setCustomers([]);
//         setError("Customer not found.");
//       } else {
//         setCustomers([response.data]);
//         setMessage("Customer found successfully.");
//       }
//     } catch (err) {
//       setCustomers([]);

//       if (err.response?.status === 404) {
//         setError("Customer not found.");
//       } else {
//         showError(err, "Search failed. Check your backend.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="app-layout">
//       <aside className="sidebar">
//         <div className="brand">
//           <span className="brand-icon">C</span>
//           <span>Customer Portal</span>
//         </div>

//         <p className="nav-label">WORKSPACE</p>

//         <button
//           className="nav-item active"
//           onClick={loadCustomers}
//           type="button"
//         >
//           <span>▦</span> Dashboard
//         </button>

//         <button
//           className="nav-item"
//           onClick={loadCustomers}
//           type="button"
//         >
//           <span>♙</span> Customers
//         </button>

//         <button
//           className="nav-item"
//           onClick={() => {
//             handleCancel();
//             window.scrollTo({ top: 0, behavior: "smooth" });
//           }}
//           type="button"
//         >
//           <span>＋</span> Add Customer
//         </button>

//         <div className="sidebar-footer">
//           <span className="status-dot" />
//           Spring Boot API
//           <small>Customer Portal v1.0</small>
//         </div>
//       </aside>

//       <main className="main-content">
        
// <header className="topbar">
//   <div>
//     <p className="topbar-caption">CUSTOMER PORTAL</p>
//     <h2>Customer Management</h2>
//   </div>
// </header>


//         <section className="page-heading">
//           <div>
//             <p className="eyebrow">CUSTOMER MANAGEMENT</p>
//             <h1>Manage your customers</h1>
//             <p className="subtitle">
//               Create, search, update and manage customer records.
//             </p>
//           </div>

//           <button
//             className="button button-light"
//             type="button"
//             onClick={loadCustomers}
//           >
//             ↻ Refresh records
//           </button>
//         </section>

//         {message && (
//           <div className="alert alert-success" role="status">
//             <span>✓</span> {message}
//             <button onClick={() => setMessage("")} type="button">
//               ×
//             </button>
//           </div>
//         )}

//         {error && (
//           <div className="alert alert-error" role="alert">
//             <span>!</span> {String(error)}
//             <button onClick={() => setError("")} type="button">
//               ×
//             </button>
//           </div>
//         )}

//         <section className="stats-grid">
//           <article className="stat-card">
//             <div className="stat-icon blue">♙</div>
//             <div>
//               <p>Total customers</p>
//               <h3>{customers.length}</h3>
//               <small>Records currently displayed</small>
//             </div>
//           </article>

//           <article className="stat-card">
//             <div className="stat-icon green">✓</div>
//             <div>
//               <p>API connection</p>
//               <h3 className="connection-text">
//                 {loading ? "Loading..." : "Ready to test"}
//               </h3>
//               <small>Spring Boot · MySQL</small>
//             </div>
//           </article>
//         </section>

//         <section className="panel">
//           <div className="section-heading">
//             <div>
//               <span className="section-tag">
//                 {editingId !== null ? "EDIT RECORD" : "NEW RECORD"}
//               </span>
//               <h2>
//                 {editingId !== null
//                   ? `Update customer #${editingId}`
//                   : "Add a customer"}
//               </h2>
//               <p>Enter the details below.</p>
//             </div>

//             {editingId !== null && (
//               <button
//                 className="button button-light"
//                 onClick={handleCancel}
//                 type="button"
//               >
//                 Cancel edit
//               </button>
//             )}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="form-grid">
//               <label>
//                 Customer name <span>*</span>
//                 <input
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="e.g. Anjali Sharma"
//                   required
//                 />
//               </label>

//               <label>
//                 Email address <span>*</span>
//                 <input
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="name@example.com"
//                   required
//                 />
//               </label>

//               <label>
//                 Phone number
//                 <input
//                   name="phone"
//                   type="tel"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   title="Enter a 10-digit phone number"
//                   value={form.phone}
//                   onChange={handleChange}
//                   placeholder="10-digit phone number"
//                 />
//               </label>

//               <label>
//                 City
//                 <input
//                   name="city"
//                   value={form.city}
//                   onChange={handleChange}
//                   placeholder="e.g. Hyderabad"
//                 />
//               </label>

//               <label>
//                 State
//                 <input
//                   name="state"
//                   value={form.state}
//                   onChange={handleChange}
//                   placeholder="e.g. Telangana"
//                 />
//               </label>
//             </div>

//             <div className="form-actions">
//               <button
//                 className="button button-primary"
//                 type="submit"
//                 disabled={saving}
//               >
//                 {saving
//                   ? "Saving..."
//                   : editingId !== null
//                     ? "✓ Save changes"
//                     : "＋ Add customer"}
//               </button>

//               <button
//                 className="button button-light"
//                 type="button"
//                 onClick={handleCancel}
//               >
//                 Reset form
//               </button>
//             </div>
//           </form>
//         </section>

//         <section className="panel">
//           <div className="section-heading">
//             <div>
//               <span className="section-tag">CUSTOMER DIRECTORY</span>
//               <h2>Customer records</h2>
//               <p>
//                 Search records by ID or email, or view all customers.
//               </p>
//             </div>
//             <span className="record-count">
//               {customers.length} record(s)
//             </span>
//           </div>

//           <div className="search-grid">
//             <form
//               className="search-box"
//               onSubmit={(event) => handleSearch(event, "id")}
//             >
//               <label htmlFor="search-id">Search by customer ID</label>
//               <div className="search-control">
//                 <input
//                   id="search-id"
//                   type="number"
//                   min="1"
//                   value={searchId}
//                   onChange={(event) => setSearchId(event.target.value)}
//                   placeholder="Enter customer ID"
//                 />
//                 <button
//                   className="button button-primary"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>

//             <form
//               className="search-box"
//               onSubmit={(event) => handleSearch(event, "email")}
//             >
//               <label htmlFor="search-email">Search by email</label>
//               <div className="search-control">
//                 <input
//                   id="search-email"
//                   type="email"
//                   value={searchEmail}
//                   onChange={(event) => setSearchEmail(event.target.value)}
//                   placeholder="Enter customer email"
//                 />
//                 <button
//                   className="button button-primary"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="table-toolbar">
//             <h3>All customer details</h3>
//             <button
//               className="button button-light"
//               type="button"
//               onClick={() => {
//                 setSearchId("");
//                 setSearchEmail("");
//                 loadCustomers();
//               }}
//             >
//               ↻ Show all
//             </button>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Customer</th>
//                   <th>Phone</th>
//                   <th>Location</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="5" className="table-empty">
//                       Loading customer records...
//                     </td>
//                   </tr>
//                 ) : customers.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="table-empty">
//                       No customers found. Add a customer or show all records.
//                     </td>
//                   </tr>
//                 ) : (
//                   customers.map((customer) => (
//                     <tr key={customer.id}>
//                       <td>
//                         <span className="id-badge">#{customer.id}</span>
//                       </td>
//                       <td>
//                         <div className="customer-cell">
//                           <span className="customer-avatar">
//                             {(customer.name || "?")
//                               .charAt(0)
//                               .toUpperCase()}
//                           </span>
//                           <div>
//                             <strong>{customer.name}</strong>
//                             <small>{customer.email}</small>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{customer.phone ?? "—"}</td>
//                       <td>
//                         <div>{customer.city || "—"}</div>
//                         <small className="muted">
//                           {customer.state || ""}
//                         </small>
//                       </td>
//                       <td>
//                         <div className="row-actions">
//                           <button
//                             className="action-edit"
//                             type="button"
//                             onClick={() => handleEdit(customer)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="action-delete"
//                             type="button"
//                             onClick={() => handleDelete(customer)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="table-footer">
//             <span>Connected to your Spring Boot customer API</span>
//             <span>{customers.length} displayed</span>
//           </div>
//         </section>

//         <footer className="footer">
//           Customer Portal <span>•</span> Built with React, Spring Boot & MySQL
//         </footer>
//       </main>
//     </div>
//   );
// }

// export default App;



import { useEffect, useState } from "react";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomerByEmail,
} from "./services/customerService";
import "./App.css";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  state: "",
};

function App() {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);

  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load all customers on initial render.
  useEffect(() => {
    let ignore = false;

    async function fetchCustomers() {
      try {
        const response = await getAllCustomers();

        if (!ignore) {
          const data = Array.isArray(response.data)
            ? response.data
            : [];

          setCustomers(data);
          setTotalCustomers(data.length);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Unable to load customers. Check your backend."
          );
        }
      }
    }

    fetchCustomers();

    return () => {
      ignore = true;
    };
  }, []);

  function clearAlerts() {
    setMessage("");
    setError("");
  }

  function showError(err, fallback) {
    const responseMessage = err.response?.data?.message;

    setError(
      typeof responseMessage === "string"
        ? responseMessage
        : fallback
    );
  }

  // GET ALL CUSTOMERS
  async function loadCustomers(showMessage = false) {
    setLoading(true);
    setError("");

    try {
      const response = await getAllCustomers();
      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setCustomers(data);
      setTotalCustomers(data.length);

      if (showMessage) {
        setMessage("All customer records loaded successfully.");
      }
    } catch (err) {
      showError(err, "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }

  // Handle form inputs.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // CREATE / UPDATE CUSTOMER
  async function handleSubmit(event) {
    event.preventDefault();
    clearAlerts();

    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    const customer = {
      ...form,
      phone:
        form.phone.trim() === ""
          ? null
          : Number(form.phone.trim()),
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await updateCustomer(editingId, customer);
        setMessage("Customer updated successfully.");
      } else {
        await createCustomer(customer);
        setMessage("Customer created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadCustomers();
    } catch (err) {
      showError(
        err,
        editingId !== null
          ? "Unable to update customer."
          : "Unable to create customer."
      );
    } finally {
      setSaving(false);
    }
  }

  // Fill form for editing.
  function handleEdit(customer) {
    setForm({
      name: customer.name ?? "",
      phone:
        customer.phone == null
          ? ""
          : String(customer.phone),
      email: customer.email ?? "",
      city: customer.city ?? "",
      state: customer.state ?? "",
    });

    setEditingId(customer.id);
    setViewCustomer(null);
    clearAlerts();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Reset form.
  function handleReset() {
    setForm(emptyForm);
    setEditingId(null);
    clearAlerts();
  }

  // DELETE CUSTOMER
  async function handleDelete(customer) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name} (ID: ${customer.id})?`
    );

    if (!confirmed) return;

    clearAlerts();

    try {
      await deleteCustomer(customer.id);

      if (editingId === customer.id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      if (viewCustomer?.id === customer.id) {
        setViewCustomer(null);
      }

      setMessage("Customer deleted successfully.");
      await loadCustomers();
    } catch (err) {
      showError(err, "Unable to delete customer.");
    }
  }

  // SEARCH BY ID OR EMAIL
  async function handleSearch(event, type) {
    event.preventDefault();
    clearAlerts();

    const value =
      type === "id"
        ? searchId.trim()
        : searchEmail.trim();

    if (!value) {
      setError(
        type === "id"
          ? "Please enter a customer ID."
          : "Please enter a customer email."
      );
      return;
    }

    if (type === "id" && !/^\d+$/.test(value)) {
      setError("Customer ID must be a valid number.");
      return;
    }

    setLoading(true);

    try {
      const response =
        type === "id"
          ? await getCustomerById(value)
          : await getCustomerByEmail(value);

      const customer = response.data;

      if (!customer || customer.id == null) {
        setCustomers([]);
        setError("Customer not found.");
        return;
      }

      setCustomers([customer]);
      setMessage(
        type === "id"
          ? "Customer found by ID."
          : "Customer found by email."
      );
    } catch (err) {
      setCustomers([]);

      if (err.response?.status === 404) {
        setError("Customer not found.");
      } else {
        showError(err, "Search failed. Check your backend.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Return to the full customer list.
  async function handleShowAll() {
    setSearchId("");
    setSearchEmail("");
    setViewCustomer(null);
    await loadCustomers(true);
  }

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 0 1 16 0H4Zm16-8a4 4 0 1 0-2-7.46 7 7 0 0 1 0 7.46Zm-1 2c2 1.2 3.1 3.1 3.1 6H24c0-3.2-1.8-5.4-5-6Z" />
            </svg>
          </span>
          <span>Customer Portal</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-item active"
            type="button"
            onClick={handleShowAll}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={handleShowAll}
          >
            <span>♙</span>
            Customers
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() => {
              handleReset();
              document
                .getElementById("customer-name")
                ?.focus();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span>＋</span>
            Add Customer
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() =>
              document.getElementById("search-id")?.focus()
            }
          >
            <span>⌕</span>
            Search by ID
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() =>
              document.getElementById("search-email")?.focus()
            }
          >
            <span>✉</span>
            Search by Email
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Customer Portal v1.0
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* Simple header: no notification or Admin buttons */}
        <header className="topbar">
          <div>
            <p className="topbar-caption">CUSTOMER WORKSPACE</p>
            <h2>Customer Management</h2>
          </div>
        </header>

        {/* FORM CARD */}
        <section className="panel form-panel">
          <div className="section-heading">
            <div className="form-title">
              <div className="form-title-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 0 1 16 0H4Zm16-8a4 4 0 1 0-2-7.46 7 7 0 0 1 0 7.46Z" />
                </svg>
              </div>

              <div>
                <h2>
                  {editingId !== null
                    ? "Update Customer"
                    : "Customer Management"}
                </h2>
                <p>
                  Add, update, delete and view customer details
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Name <span className="required">*</span>
                <div className="input-with-icon">
                  <span aria-hidden="true">♙</span>
                  <input
                    id="customer-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
              </label>

              <label>
                Phone
                <div className="input-with-icon">
                  <span aria-hidden="true">♧</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </label>

              <label>
                Email <span className="required">*</span>
                <div className="input-with-icon">
                  <span aria-hidden="true">✉</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </label>

              <label>
                City
                <div className="input-with-icon">
                  <span aria-hidden="true">♧</span>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
              </label>

              <label>
                State
                <div className="input-with-icon">
                  <span aria-hidden="true">⌑</span>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>
              </label>

              <div className="form-actions">
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "✓ Update Customer"
                      : "＋ Add Customer"}
                </button>

                <button
                  className="button button-light"
                  type="button"
                  onClick={handleReset}
                >
                  ↻ Reset
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* ALERT MESSAGES */}
        {message && (
          <div className="alert alert-success" role="status">
            <span>✓</span>
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <span>!</span>
            <span>{String(error)}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error message"
            >
              ×
            </button>
          </div>
        )}

        {/* SEARCH AND CUSTOMER TABLE */}
        <section className="panel records-panel">
          <div className="search-grid">
            <form
              className="search-box"
              onSubmit={(event) => handleSearch(event, "id")}
            >
              <div className="search-control">
                <span aria-hidden="true">#</span>
                <input
                  id="search-id"
                  type="number"
                  min="1"
                  value={searchId}
                  onChange={(event) => setSearchId(event.target.value)}
                  placeholder="Search by Customer ID"
                  aria-label="Search by customer ID"
                />
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={loading}
                >
                  Search
                </button>
              </div>
            </form>

            <form
              className="search-box"
              onSubmit={(event) => handleSearch(event, "email")}
            >
              <div className="search-control">
                <span aria-hidden="true">✉</span>
                <input
                  id="search-email"
                  type="email"
                  value={searchEmail}
                  onChange={(event) =>
                    setSearchEmail(event.target.value)
                  }
                  placeholder="Search by Email"
                  aria-label="Search by customer email"
                />
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={loading}
                >
                  Search
                </button>
              </div>
            </form>

            <button
              className="button button-light show-all-button"
              type="button"
              onClick={handleShowAll}
              disabled={loading}
            >
              ↻ Show All
            </button>
          </div>

          <div className="records-heading">
            <div>
              <h2>Customer Records</h2>
              <p>Total Customers: {totalCustomers}</p>
            </div>

            <button
              className="button button-light refresh-button"
              type="button"
              onClick={() => loadCustomers(true)}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {/* CUSTOMER TABLE */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="table-empty">
                      Loading customer records...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="table-empty">
                      No customer records found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>
                        <strong>{customer.name}</strong>
                      </td>
                      <td>{customer.phone ?? "—"}</td>
                      <td>{customer.email}</td>
                      <td>{customer.city || "—"}</td>
                      <td>{customer.state || "—"}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="action-edit"
                            type="button"
                            onClick={() => handleEdit(customer)}
                          >
                            ✎ Edit
                          </button>

                          <button
                            className="action-delete"
                            type="button"
                            onClick={() => handleDelete(customer)}
                          >
                            ▤ Delete
                          </button>

                          <button
                            className="action-view"
                            type="button"
                            onClick={() => setViewCustomer(customer)}
                          >
                            ◉ View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {customers.length} of {totalCustomers} customers
            </span>
            <span>Customer Portal v1.0</span>
          </div>
        </section>

        <footer className="footer">
          Customer Portal <span>•</span> React.js · Spring Boot · MySQL
        </footer>
      </main>

      {/* VIEW CUSTOMER MODAL */}
      {viewCustomer && (
        <div
          className="modal-overlay"
          onClick={() => setViewCustomer(null)}
        >
          <section
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-customer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p className="section-tag">CUSTOMER DETAILS</p>
                <h2 id="view-customer-title">
                  {viewCustomer.name}
                </h2>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={() => setViewCustomer(null)}
                aria-label="Close customer details"
              >
                ×
              </button>
            </div>

            <dl className="customer-details">
              <div>
                <dt>Customer ID</dt>
                <dd>{viewCustomer.id}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{viewCustomer.name || "—"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{viewCustomer.phone ?? "—"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{viewCustomer.email || "—"}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{viewCustomer.city || "—"}</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{viewCustomer.state || "—"}</dd>
              </div>
            </dl>

            <div className="form-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => handleEdit(viewCustomer)}
              >
                ✎ Edit Customer
              </button>

              <button
                className="button button-light"
                type="button"
                onClick={() => setViewCustomer(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
