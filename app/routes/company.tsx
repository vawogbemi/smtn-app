import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function Company(){

    return (
        <Box w={"90vw"} bg={"white"} color={"blackAlpha.800"} borderRadius={10} p={10} maxH={"80vh"}>
            <Outlet />
        </Box>
    )
}