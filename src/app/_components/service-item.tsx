"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { format, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { getBookings } from "../_actions/get-bookings"
import SignInDialog from "./sign-in-dialog"
import { Dialog, DialogContent } from "./ui/dialog"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
]

const getTimeList = (bookings: Booking[]) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const hasBookingsOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        bookings.some((booking) => booking.date.getMinutes() === minute),
    )

    if (hasBookingsOnCurrentTime) {
      return false
    }

    return true
  })
}

export const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [isBookingsSheetOpen, setIsBookingSheetOpen] = useState(false)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  const { data } = useSession()

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }

    fetch()
  }, [selectedDay, service.id])

  const handleDateSelect = (data?: Date) => {
    setSelectedDay(data)
  }

  const handleBookingClick = () => {
    if (data?.user) {
      return setIsBookingSheetOpen(true)
    }

    return setIsSignInDialogOpen(true)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedDay(undefined)
    setDayBookings([])
    setIsBookingSheetOpen(false)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return

      const hours = Number(selectedTime.split(":")[0])
      const minutes = Number(selectedTime.split(":")[1])
      const newDate = set(selectedDay, {
        minutes,
        hours,
      })

      await createBooking({
        serviceId: service.id,
        date: newDate,
      })
      handleSheetOpenChange()
      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      console.log("ERRO: ", error)
    }
  }

  function renderTimesAvailable() {
    if (!selectedDay) return null

    return (
      <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::webkit-scrollbar]:hidden">
        {getTimeList(dayBookings).map((time) => {
          const buttonTimeSelectingVariant =
            selectedTime === time ? "default" : "outline"

          return (
            <Button
              key={time}
              variant={buttonTimeSelectingVariant}
              className="rounded-full"
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </Button>
          )
        })}
      </div>
    )
  }

  function renderSummaryBooking() {
    if (!selectedTime || !selectedDay) return null

    return (
      <div className="p-5">
        <Card>
          <CardContent className="space-y-3 p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">{service.name}</h2>
              <p className="text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400">Data</h2>
              <p className="text-sm">
                {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400">Horário</h2>
              <p className="text-sm">{selectedTime}</p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400">Barbearia</h2>
              <p className="text-sm">{barbershop.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  function renderConfirmBookingButton() {
    if (!selectedTime || !selectedDay) return null

    return (
      <SheetFooter className="px-5">
        <SheetClose asChild>
          <Button type="submit" onClick={handleCreateBooking}>
            Confirmar
          </Button>
        </SheetClose>
      </SheetFooter>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={isBookingsSheetOpen}
                onOpenChange={handleSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer reserva</SheetTitle>
                  </SheetHeader>
                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>
                  {renderTimesAvailable()}
                  {renderSummaryBooking()}
                  {renderConfirmBookingButton()}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isSignInDialogOpen}
        onOpenChange={(open) => setIsSignInDialogOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}
