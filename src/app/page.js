"use client";
import React,{useState,useEffect} from 'react'
import { IoIosNotifications } from "react-icons/io";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function Page() {
  const [transactions,setTransactions]=useState([])
  const fetchTransaction = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "052f286de4087ef83371235a2b565f28f51ed7513bd7b1c749b80743dc0bb3d0",
        },
      });
  
      console.log("Status:", response.status);
  
      const data = await response.json();
      console.log(data);
  
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(()=>{
   fetchTransaction()
  },[])
  return (
    <main className="container">
      <div className="dashboard">

        <header className="header">
          <div className="user-info">
            <div className="initials">
              <h1>I</h1>
            </div>

            <div className="greeting">
              <p>Good Morning</p>
              <h2>Welcome back, Isabella</h2>
            </div>
          </div>

          <div className="bell">
            <IoIosNotifications />
          </div>
        </header>

        {/* Balance Card */}
        <section className="balance-card">
          <p>Available Balance</p>
          <h1>₦0</h1>
          <div className="account">
          <h3>5399*******2147</h3>
          <h2>VISA</h2>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="actions">
          <button className="income-btn">
            <FaArrowDown />
            Add Income
          </button>

          <button className="expense-btn">
            <FaArrowUp />
            Add Expense
          </button>
        </section>

        {/* Statistics */}
        <section className="stats">
          <div className="stat-card">
            <p>Total Income</p>
            <h3>₦0</h3>
          </div>

          <div className="stat-card">
            <p>Total Expense</p>
            <h3 id='exp2'>₦0</h3>
          </div>
        </section>

      </div>
    
      <section className="transactions">
  <div className="transactions-header">
    <h2>Recent Transactions</h2>
    <button>See All</button>
  </div>

  <div className="transaction-list">
    {transactions.length > 0 ? (
      transactions.map((item) => (
        <div key={item._id} className="transaction-card">
          <div className="transaction-icon">
            {item.category === "income" ? (
              <FaArrowDown />
            ) : (
              <FaArrowUp />
            )}
          </div>

          <div className="transaction-details">
            <h4>{item.description}</h4>
            <p>{item.category}</p>
          </div>

          <div
            className={
              item.category === "income"
                ? "transaction-amount income"
                : "transaction-amount expense"
            }
          >
            {item.category === "income" ? "+" : "-"}₦
            {item.amount.toLocaleString()}
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

