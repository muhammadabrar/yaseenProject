"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const Page = () => {
    const [items, setItems] = useState([])
    const [search, setSearch] = useState("")
    const [cnic, setCNIC] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      const res = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cnic, description }),
      })
      const data = await res.json()
      if (res.ok) {
        setCNIC("")
        setDescription("")
      } else {
        setError(data.error || "An error occurred")
      }
    }
  
    return (
        <div className="container md:w-1/3 mx-auto p-4">
            <div>
          <h2 className="text-2xl font-bold mb-4">Add Your CNIC</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cnic" className="block mb-1">
                CNIC:
              </label>
              <input
            type="text"
            id="cnic"
            value={cnic}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 13) {
                setCNIC(value);
              }
            }}
            required
            className="w-full p-2 border rounded appearance-none"
            maxLength={13}
          />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">
                Description:
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Submit
            </button>
          </form>
        </div>
        </div>
    );
}

export default Page;
