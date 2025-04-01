import { NextResponse } from "next/server"
import { seedAllData } from "@/lib/seed-data"

export async function GET() {
  try {
    await seedAllData()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, message: "Error seeding database" }, { status: 500 })
  }
}

