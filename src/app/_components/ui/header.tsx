import { MenuIcon } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import Image from "next/image"

export function Header() {
  return (
    <Card className="rounded-t-none">
      <CardContent className="flex items-center justify-between p-5">
        <Image src="/logo.png" alt="BarberShop Logo" width={150} height={50} />
        <Button size="icon" variant="outline">
          <MenuIcon />
        </Button>
      </CardContent>
    </Card>
  )
}
