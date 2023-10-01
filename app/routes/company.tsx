import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function Company(){
    return (
        <Box w={"90vw"}>
            <Outlet />
        </Box>
    )
}