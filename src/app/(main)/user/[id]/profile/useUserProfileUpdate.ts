"use client"

import React, {useEffect, useState} from "react";
import {UserProfile} from "@/app/(main)/user/[id]/page";
import lightApi from "@/lib/ApiClient";
import {useRouter} from "next/navigation";


interface UserProfileUpdateForm {
    defaultNickName:string;
    nickName: string;
    bio: string;
}

export default function useUserProfileUpdate(open:boolean, setOpen:(v:boolean)=>void){
    const router = useRouter();



    const [userProfileForm, setUserProfileForm] = useState<UserProfileUpdateForm>({
        defaultNickName: "",
        nickName: "",
        bio: ""
    });

    useEffect(()=>{
        const getUserEditInfo = async () =>{
            const res = await lightApi.get<UserProfileUpdateForm>('/api/v1/users/profiles/edit')
                .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL)
                .isCredentialRequest(true)

            setUserProfileForm({
                defaultNickName:res.defaultNickName,
                nickName:res.nickName?res.nickName:res.defaultNickName,
                bio:res.bio
            })

        }

        if(open){
            getUserEditInfo().catch((e)=>console.error(e))
        }

    },[open])

    const onChangeField = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;

        setUserProfileForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const requestUpdate = async()=>{
        lightApi.patch('/api/v1/users/profiles')
            .body(userProfileForm)
            .isCredentialRequest(true)
            .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL)
            .then((_)=>{
                router.refresh();
                setOpen(false);
            })
            .catch((e)=>console.error(e))
    }

    return { userProfileForm , onChangeField , requestUpdate }
}