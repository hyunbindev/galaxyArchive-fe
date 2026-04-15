import {UploadPhase, UploadStatus} from "@/app/(main)/article/write/useCreateArticle";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Field, FieldLabel} from "@/components/ui/field";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";


interface Props{
    upLoadState:UploadStatus
}

export default function UploadStatusModal({upLoadState}:Props){
    const router = useRouter()
    return(
        <Dialog open={true}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>GalaxyArchive</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-gray-600">
                    Launching Article to GalaxyArchive...
                </DialogDescription>

                {upLoadState.imageStatus && Array.from(upLoadState.imageStatus).map(([pos, percent]) => (

                    <Field key={pos} className="w-full text-gray-500">
                        <FieldLabel className="text-xs font-light" htmlFor="progress-upload">
                            <span>{percent == 100 ? "Image launch complete!":"Launching image.."}</span>
                            <span className="ml-auto">{percent}%</span>
                        </FieldLabel>
                        <Progress value={percent} id="progress-upload" />
                    </Field>
                ))}

                <Field className="w-full text-gray-500">
                    <FieldLabel className="text-xs font-light" htmlFor="progress-upload">
                        <span>{upLoadState.uploadPhase == UploadPhase.SUCCESS ?"Complete launch article":"Launching article.."}</span>
                        <span className="ml-auto">{upLoadState.uploadPhase == UploadPhase.SUCCESS ? 100 : 0}%</span>
                    </FieldLabel>
                    <Progress value={upLoadState.uploadPhase == UploadPhase.SUCCESS ? 100 : 0} id="progress-upload" />
                </Field>

                {upLoadState.uploadPhase == UploadPhase.SUCCESS &&
                    <div className={"flex justify-center pt-3"}>
                        <Button className={"cursor-pointer w-1/2"} onClick={()=>router.replace(`/article/${upLoadState.articleId}`)}>Confirm</Button>
                    </div>}
            </DialogContent>
        </Dialog>
    )
}