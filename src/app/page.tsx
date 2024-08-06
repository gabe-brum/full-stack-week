import { SearchIcon } from "lucide-react"
import { Header } from "./_components/ui/header"
import { Input } from "./_components/ui/input"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { BarbershopItem } from "./_components/barbershop-item"
import { db } from "./_lib/prisma"
import { quickSearchOptions } from "./_constants/quickSearch"
import { BookingItem } from "./_components/booking-item"

export default async function Home() {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá Gabriel</h2>
        <p>Segunda-feira, 05 de agosto</p>
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button size="icon">
            <SearchIcon />
          </Button>
        </div>

        <div className="mt-6 flex gap-3 overflow-x-scroll [&::webkit-scrollbar]:hidden">
          {quickSearchOptions.map((quickSearch) => (
            <Button
              key={quickSearch.title}
              variant="secondary"
              className="gap-2"
            >
              <Image
                src={quickSearch.imageUrl}
                width={12}
                height={12}
                alt={quickSearch.title}
              />
              {quickSearch.title}
            </Button>
          ))}
        </div>

        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner1.png"
            fill
            className="object-fit rounded-xl"
            alt="Agende seu horário"
          />
        </div>

        <BookingItem />

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400 antialiased">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400 antialiased">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <footer className="bg-[#1A1B1F] px-5 py-6">
        <p className="text-sm text-gray-400">
          © 2023 Copyright <strong>FSW Barber</strong>
        </p>
      </footer>
    </div>
  )
}
