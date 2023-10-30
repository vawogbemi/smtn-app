import { Box } from "@chakra-ui/react";
import { Outlet, useOutletContext } from "@remix-run/react";

export default function Employee(){
    const { supabase, session, users, groupedUsers } = useOutletContext<any>()
    return (
        <Box bg={"white"} color={"#4299E1"} borderRadius={10} p={10} w={"90vw"} overflowY={"scroll"}>
            <Outlet context={{supabase, session, users, groupedUsers}}/>
        </Box>
    )
}