import { toast } from "sonner";

export const Toast = {
  success: (content: string) => {
    toast(content, { position: "top-center" });
  },
  error: (content: string) => {
    toast.error(content, {
      position: "top-center",
    });
  },
};
