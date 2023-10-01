import { Box } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { SupabaseClient, createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";



export const loader = async ({ request }: LoaderFunctionArgs) => {

    const response = new Response()

    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const user = await supabase.auth.getUser()

    const { data: userPackages } = await supabase.from("packages").select().eq("user_id", user.data.user?.id)


    return json(
        {
            userPackages,
        },
        {
            headers: response.headers,
        }
    )
}

export default function MyPackages() {
    const { userPackages } = useLoaderData<typeof loader>()
    console.log(userPackages)
    return (
        <Box maxH={"70vh"}>
        </Box>
    )
}