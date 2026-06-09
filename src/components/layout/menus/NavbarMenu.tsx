"use client"
import { Compass } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Button {
  label: string
  route: string
  imgSrc: string
}

interface NavbarMenuProps {
  buttons: Button[]
  accountControls?: React.ReactNode
  textPagina?: string
}

export default function NavbarMenu({ buttons, accountControls, textPagina }: NavbarMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (button: Button) => {
    router.push(button.route)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-[15%] p-3 sm:p-0 flex justify-center items-center bg-white border border-black ">
        <h1 className="text-2xl font-bold text-[#3C98CB]">NEGO</h1>
      </div>

      <div className="w-full sm:w-[85%]">
        <div className="flex flex-col h-full">
          <div className="flex flex-col justify-between items-center sm:flex-row bg-white p-3 sm:p-2">
            <div className="flex-1">
              <span className="text-[#3C98CB] font-semibold text-xl">Bienvenido, cliente</span>

            </div>
            <div className="flex flex-1 justify-end space-x-4">
              {accountControls && (
                <div className="flex w-8/12 items-center space-x-2">
                  {accountControls}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#5D6D7D] flex">
            <div className="hidden sm:flex flex-wrap">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => handleNavigation(button)}
                  className="bg-[#5D6D7D] space-x-4 font-semibold text-white p-3 flex items-center min-w-32"
                >
                  <img src={button.imgSrc} alt={button.label} className="w-6 h-6 mr-2" />
                  <span>{button.label}</span>
                </Button>
              ))}
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button className="sm:hidden bg-[#5D6D7D] text-white p-3">
                  <Compass  />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-[#5D6D7D]">
                <div className="w-full p-3 mt-5 flex justify-center items-center bg-white border border-black">
                  <h1 className="text-2xl font-bold text-[#3C98CB]">NEGO</h1>
                </div>
                <div className="flex flex-col space-y-4 mt-4">
                  {buttons.map((button, index) => (
                    <Button
                      key={index}
                      onClick={() => handleNavigation(button)}
                      variant={'ghost'}
                      className=" space-x-4 font-semibold text-white  flex items-center justify-start "
                    >
                      <img src={button.imgSrc} alt={button.label} />
                      <span>{button.label}</span>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="bg-[#3C98CB] p-2">
            <h2 className="text-xl text-[#FFFFFF] font-semibold text-center sm:text-start">{textPagina}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}