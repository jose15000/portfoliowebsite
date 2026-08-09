import Image from "next/image";


type props = {
    src: string;
    isUser: boolean;
}
export function UserPictures ({src, isUser}: props) {
    return (

    <div className="">
        
        <Image src={src} alt={"me"} width={100} height={100} className="w-fit"/>
        <span>
            {isUser ? ">" : ""}
        </span>
    </div>
    )
}