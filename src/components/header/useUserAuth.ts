import {useRouter} from "next/navigation";

export default function  useUserAuth(){
    const router = useRouter();
    const logout = async ()=>{

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,{
            method: 'POST',
            credentials: 'include',
        })
        router.refresh()
    }
    return { logout }
}