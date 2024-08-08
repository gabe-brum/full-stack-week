import { BarbershopItem } from "../_components/barbershop-item"
import { Header } from "../_components/header"
import Search from "../_components/search"
import { db } from "../_lib/prisma"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
}

const BarbershopPage = async ({ searchParams }: BarbershopsPageProps) => {
  const { title, service } = searchParams

  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        searchParams?.title
          ? {
              name: {
                contains: title,
                mode: "insensitive",
              },
            }
          : {},
        searchParams.service
          ? {
              services: {
                some: {
                  name: {
                    contains: service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  })

  function renderBarbershops() {
    if (barbershops.length === 0) {
      return (
        <h1 className="mt-6 w-full px-5 text-xl font-bold text-gray-400 antialiased">
          Desculpe, não encontramos nenhum Barbershop! Tente buscar algo
          diferente.
        </h1>
      )
    }

    return (
      <div className="mb-4 px-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400 antialiased">
          Resultados para &quot;{title || service}&quot;
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="my-6 px-5">
        <Search />
      </div>
      {renderBarbershops()}
    </div>
  )
}

export default BarbershopPage
