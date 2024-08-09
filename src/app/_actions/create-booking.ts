"use server"

import { db } from "../_lib/prisma"

interface CreateBookingProps {
  userId: string
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingProps) => {
  await db.booking.create({
    data: params,
  })
}
