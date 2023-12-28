import { Box } from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { isEmployee } from "~/utils/utils";

export default function Employee(){
    const { session, user, users, shipments, cargo, boxes } = useOutletContext<any>()

    if (!session || !isEmployee(session.user.id)){
        throw redirect("/")
    }
    
    if (!user){
        throw redirect("/account")
    }

    return (
        <Box bg={"white"} color={"blackAlpha.800"} borderRadius={10} p={10} w={"90vw"} overflowY={"auto"} maxH={"80vh"}>
            <Outlet context={{session, user, users, shipments, cargo, boxes}}/>
        </Box>
    )
}