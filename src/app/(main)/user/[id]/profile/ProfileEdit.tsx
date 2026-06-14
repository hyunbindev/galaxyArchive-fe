"use client"

import {
    Dialog, DialogClose,
    DialogContent,
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
import {UserProfile} from "@/app/(main)/user/[id]/page";
import {cn} from "@/lib/utils";
import useUserProfileUpdate from "@/app/(main)/user/[id]/profile/useUserProfileUpdate";
import {useState} from "react";

interface ProfileEditProps{
    userProfile:UserProfile;
}


export default function ProfileEdit({ userProfile }:ProfileEditProps){
    const [open, setOpen] = useState<boolean>(false);
    const { userProfileForm , onChangeField , requestUpdate } = useUserProfileUpdate(open,setOpen);
    return(
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                        <Pencil/>Edit
                    </Button>
            </DialogTrigger>

            <DialogOverlay className="fixed inset-0 z-50 backdrop-blur-[2px]"/>


            <DialogContent className="sm:max-w-sm">

                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>

                <FieldGroup className={cn("gap-2")}>
                    <Field className={cn("gap-2")}>
                        <Label htmlFor="nickName">Name</Label>
                        <Input id="name" name="nickName" onChange={onChangeField} placeholder={userProfileForm.defaultNickName} value={userProfileForm.nickName} autoComplete="off"/>
                    </Field>
                    <Field className={cn("gap-2")}>
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" name="bio" onChange={onChangeField} value={userProfileForm.bio} autoComplete="off"/>
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={requestUpdate}>Save changes</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}