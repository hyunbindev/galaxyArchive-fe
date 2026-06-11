import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";

export default function ProfileEdit(){
    return(
        <Dialog>

            <DialogTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                        <Pencil/>Edit
                    </Button>
            </DialogTrigger>

            <DialogOverlay className="fixed inset-0 z-50 backdrop-blur-[2px]"/>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue="Pedro Duarte" autoComplete="off"/>
                    </Field>
                    <Field>
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" name="bio" defaultValue="@peduarte" autoComplete="off"/>
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}