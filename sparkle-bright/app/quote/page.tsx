"use client";


import { useState } from "react";


export default function Quote() {

  const [form, setForm] = useState({

    name: "",

    email: "",

    details: "",

  });


  return (

    <div>

      <h2>Request a Quote</h2>


      <form

        onSubmit={(e) => {

          e.preventDefault();

          alert("Quote request submitted (frontend only MVP)");

        }}

        style={{ maxWidth: "400px" }}

      >

        <input

          placeholder="Name"

          onChange={(e) => setForm({ ...form, name: e.target.value })}

          style={input}

        />


        <input

          placeholder="Email"

          onChange={(e) => setForm({ ...form, email: e.target.value })}

          style={input}

        />


        <textarea

          placeholder="Project details"

          onChange={(e) => setForm({ ...form, details: e.target.value })}

          style={{ ...input, height: "120px" }}

        />


        <button style={btn}>Send Request</button>

      </form>

    </div>

  );

}


const input: React.CSSProperties = {

  display: "block",

  width: "100%",

  margin: "0.5rem 0",

  padding: "0.5rem",

};


const btn: React.CSSProperties = {

  marginTop: "1rem",

  padding: "0.7rem",

};
