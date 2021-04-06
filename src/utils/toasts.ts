import { toast } from "react-toastify";

export function toastWarn(text: string) {
    toast(text, {
        style: {
            backgroundColor: "orange",
            color: "black"
        },
        position: 'bottom-right'
    })
}

export function toastInfo(text: string) {
    toast(text, {
        style: {
            backgroundColor: "blue",
            color: "black"
        },
        position: 'bottom-right'
    })
}