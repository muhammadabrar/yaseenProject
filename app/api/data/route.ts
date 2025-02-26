import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""

  const client = await clientPromise
  const db = client.db("yaseenData")
  const data = await db
    .collection("items")
    .find({
      $or: [{ cnic: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    })
    .toArray()

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { cnic, description } = await request.json()

  const client = await clientPromise
  const db = client.db("yaseenData")

  // Check if the cnic already exists
  const existingItem = await db.collection("items").findOne({ cnic })
  if (existingItem) {
    return NextResponse.json({ error: "CNIC already exists" }, { status: 400 })
  }

  const result = await db.collection("items").insertOne({
    cnic,
    description,
  })

  return NextResponse.json({ success: true, id: result.insertedId })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("yaseenData")

  const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

