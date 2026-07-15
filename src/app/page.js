 "use client";

import React, { useState, useEffect } from 'react'
import { IoIosNotifications } from "react-icons/io";
import {
  FaArrowDown,
  FaArrowUp,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GiPencil } from "react-icons/gi";
import { MdOutlineDelete } from "react-icons/md";

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const API_URL = "http://localhost:5000/api";
  const API_KEY = "052f286de4087ef83371235a2b565f28f51ed7513bd7b1c749b80743dc0bb3d0"// Move this to .env.local in production

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const deleteTransaction = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    
    try {
      // Check if your API expects /delete-transaction or /transactions/:id
      const response = await fetch(`${API_URL}/delete-transaction`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ id })
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchTransaction(); // Refresh list
        alert("Transaction deleted successfully!");
      } else {
        alert(`Error: ${data.message || "Failed to delete transaction"}`);
      }
    } catch (error) {
      alert("Network error deleting transaction");
    }
  };

  const income = transactions
    .filter(item => item.category === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0); // Cast to Number

  const expense = transactions
    .filter(item => item.category === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0); // Cast to Number

  const balance = income - expense;
  const openForm = (category) => {
    setEditingId(null);
  
    setFormData({
      category,
      amount: "",
      description: "",
    });
  
    setShowForm(true);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const editTransaction = (transaction) => {
  setEditingId(transaction._id);

  setFormData({
    category: transaction.category,
    amount: transaction.amount,
    description: transaction.description,
  });

  setShowForm(true);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    try {
      const transactionToSubmit = {
        ...formData,
        amount: amountNum,
      };

const url = editingId
? `${API_URL}/update-transaction`
: `${API_URL}/create-transaction`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url, {
method,
headers: {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
},
body: JSON.stringify({
  _id: editingId,
  ...transactionToSubmit,
}),
});

      const data = await response.json();
      
      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          category: "",
          amount: "",
          description: "",
        });
        
        fetchTransaction();
        
        alert(
          editingId
            ? "Transaction updated successfully!"
            : "Transaction added successfully!"
        )};
    } catch (error) {
      alert("Network error adding transaction");
    } finally {
      setSubmitting(false);
    }
  };
  const hour = new Date().getHours();
  const greeting = hour < 12? "Good Morning" : hour < 17? "Good Afternoon" : "Good Evening";
  return (
    <main className="container">
      <div className="dashboard">
        <header className="header">
          <div className="user-info">
            <div className="initials"><h1>I</h1></div>
            <div className="greeting">
  <p>{greeting}</p>
  <h2>Welcome back, Isabella</h2>
</div>
          </div>
          <div className="bell"><IoIosNotifications /></div>
        </header>

        <section className="balance-card">
  <p>Available Balance</p>

  <div className="balance-header">
    <h1>
      {showBalance
        ? `₦${balance.toLocaleString()}`
        : "••••••••"}
    </h1>

    <span
      className="eye-icon"
      onClick={() => setShowBalance(!showBalance)}
    >
      {showBalance ? <FaEye /> : <FaEyeSlash />}
    </span>
  </div>

  <div className="account">
    <h3>
      {showBalance ? "5399*******2147" : "•••• •••• •••• ••••"}
    </h3>
    <h2>VISA</h2>
  </div>
</section>

        <section className="actions">
          <button className="income-btn" onClick={() => openForm("income")}>
            <FaArrowDown /> Add Income
          </button>
          <button className="expense-btn" onClick={() => openForm("expense")}>
            <FaArrowUp /> Add Expense
          </button>
        </section>

        {showForm && (
          <div className="transaction-form">
          <h3>
  {editingId
    ? "Edit Transaction"
    : `Add ${formData.category === "income" ? "Income" : "Expense"}`}
</h3>
            <form onSubmit={handleSubmit}>
              <label>Category</label>
              <input type="text" name="category" value={formData.category} readOnly />

              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
              />

              <button type="submit" disabled={submitting}>
              {submitting
  ? "Saving..."
  : editingId
  ? "Update Transaction"
  : "Save Transaction"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        <section className="stats">
          <div className="stat-card">
            <p>Total Income</p>
<h3>
{showBalance
  ? `₦${income.toLocaleString()}`
  : "••••••"}
</h3>          </div>
          <div className="stat-card">
            <p>Total Expense</p>
<h3>
{showBalance
  ? `₦${expense.toLocaleString()}`
  : "••••••"}
</h3>
          </div>
        </section>
      </div>

      <section className="transactions">
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
          <button>See All</button>
        </div>

        <div className="transaction-list">
          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length > 0 ? (
            transactions.map((item) => (
              <div key={item._id} className="transaction-card">
                <div className="transaction-icon">
                  {item.category === "income" ? <FaArrowDown /> : <FaArrowUp />}
                </div>

                <div className="transaction-details">
                  <h4>{item.description}</h4>
                  <p>{item.category}</p>
                  <p>{new Date(item.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}</p>
                </div>

                <div className={item.category === "income" ? "transaction-amount income" : "transaction-amount expense"}>
                  {item.category === "income" ? "+" : "-"}₦
                  {Number(item.amount).toLocaleString()}
                  <span id='delete-icon' onClick={() => deleteTransaction(item._id)}>
                    <MdOutlineDelete />
                  </span>
                <span onClick={() => editTransaction(item)}>
  <GiPencil />
</span>
                    
                </div>
              </div>
            ))
          ) : (
            <div className="empty-transactions">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
