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
        <Box bg={"white"} color={"#4299E1"} borderRadius={10} p={10} w={"90vw"} overflowY={"scroll"}>
            <Outlet context={{session, user, users, shipments, cargo, boxes}}/>
        </Box>
    )
}