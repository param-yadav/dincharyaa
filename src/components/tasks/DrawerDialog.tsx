
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DrawerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const DrawerDialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}: DrawerDialogProps) => {
  const [open, setOpen] = useState(isOpen);
  const isMobile = useIsMobile();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} onClose={handleClose}>
      <DrawerContent className="max-w-[95%] sm:max-w-[600px] mx-auto rounded-t-xl">
        <DrawerHeader className="border-b border-border relative">
          <DrawerTitle className="text-center">{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
          <DrawerClose className="absolute right-4 top-4" onClick={handleClose}>
            <X className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 max-h-[70vh] overflow-auto">
          {children}
        </div>
        <DrawerFooter className="border-t border-border">
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
