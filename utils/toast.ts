import { toast } from "sonner";

const Toast = {

    error(string: string) {
        toast.error("Erro", {
            description: string,
            style: {
                backgroundColor: "#e64b51",
                borderRadius: "0.5rem",
                color: "white"
            },
            position: "top-right"
        });
    },

    success(string: string) {
        toast.success("Sucesso", {
            description: string,
            style: {
                backgroundColor: "#00a63e",
                borderRadius: "0.5rem",
                color: "white"
            },
            position: "top-right"
        });
    }
}

export default Toast