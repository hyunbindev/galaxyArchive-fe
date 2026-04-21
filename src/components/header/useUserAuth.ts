import {useRouter} from "next/navigation";

export default function  useUserAuth(){
    const router = useRouter();
    const logout = async ()=>{

        const res = await fetch(`/api/v1/auth/logout`,{
            method: 'POST',
            credentials: 'include',
        })
        router.refresh()
    }
    return { logout }
}