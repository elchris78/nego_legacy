import { Button } from "@/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog"
import Image from "next/image"

import Alerta from "@/Asset/Alert.png"

interface DeleteUserModalProps {
  onConfirm: () => void
  userName: string
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  text: string
}

export default function DeleteUser({ onConfirm, userName, open, setOpen, title, text }: DeleteUserModalProps) {
  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[725px] p-0 bg-white">
        <DialogHeader className="bg-[#3C98CB] text-white p-6">
          <DialogTitle className="flex justify-between items-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex ">
          <div className="flex w-1/4 justify-center items-center">
            <Image src={Alerta} alt="Alerta" />
          </div>
          <div className="p-6  w-3/4">
            <div className="border-[2px] border-solid border-red-500 p-3">
              <p className="text-sm text-gray-600 font-bold">
                {text} {userName}
              </p>
            </div>
            
            <DialogFooter className="flex justify-start p-6 space-x-4">
              <Button type="button" className="p-5 w-44 bg-[#1E2945]" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="p-5 w-44 bg-[#3C98CB]" type="button" onClick={handleConfirm}>
                Confirmar
              </Button>
            </DialogFooter>
          </div>
        </div>
        
        
      </DialogContent>
    </Dialog>
  )
}
