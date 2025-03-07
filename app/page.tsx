"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Item {
  _id: string;
  cnic: string;
  description: string;
  createdAt: Date;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await fetch(`/api/data?search=${search}`)
      const data: Item[] = await res.json()
      setItems(data)
    } catch (error) {
      setError("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id?: string): Promise<void> => {
    if (!id) {
      const result = window.confirm(`Do you want to delete all data? total records ${items.length}`)
      console.log(result);
      
      if (!result) return;
    }
    setLoading(true)

    try {
      const res = await fetch(id? `/api/data?id=${id}`: `/api/data`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchData()
      } else {
        setError("Failed to delete item")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (): void => {
    const correctPassword = "N.adil@148" // Change this to a more secure method
    if (password === correctPassword) {
      setIsAuthenticated(true)
    } else {
      setError("Incorrect password")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container md:w-1/2 mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="px-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    )
  }

  return (
    <div className="container md:w-1/2 mx-auto p-4">
      <div className="">
        <div className="w-full">
          <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">ALL CNIC's</h2>
          <button className="px-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={() => handleDelete()}>Delete ALL</button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex mb-4 items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button className="px-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={fetchData} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          {loading && <p className="text-gray-500">Loading data...</p>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-start">#</th>
                  <th className="p-2 text-start">CNIC</th>
                  <th className="p-2 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr className="border-b" key={item._id}>
                    <td className="text-bold p-2">{index + 1}</td>
                    <td className="p-2">
                      <p>{item.cnic}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </td>
                    <td className="text-end p-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}