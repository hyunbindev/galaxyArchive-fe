"use client"

import React, {useEffect, useState} from "react";
import {UserProfile} from "@/app/(main)/user/[id]/page";
import lightApi from "@/lib/ApiClient";
import {useRouter} from "next/navigation";


interface UserProfileUpdateForm {
    nickName: string;
    bio: string;
}


export default function useUserProfileUpdate(userProfile:UserProfile, open:boolean, setOpen:(v:boolean)=>void){
    const router = useRouter();
    const [userProfileForm, setUserProfileForm] = useState<UserProfileUpdateForm>({
        nickName:userProfile.nickName,
        bio:userProfile.bio
    });

    useEffect(()=>{
        if(open){
            setUserProfileForm({
                nickName:userProfile.nickName,
                bio:userProfile.bio
            });
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