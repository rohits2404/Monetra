import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
    (typeof client.api.plaid)["connected-bank"]["$delete"],
    200
>;

export const useDeleteConnectedBank = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.plaid["connected-bank"].$delete();

            if (!response.ok) {
                throw Error("Failed To Delete Connected Bank");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Connected Bank Deleted");
            queryClient.invalidateQueries({ queryKey: ["connected-bank"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed To Delete Connected Bank");
        },
    });

    return mutation;
};
