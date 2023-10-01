import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function Packages(){
    return (
        <Box bg={"white"} color={"#4299E1"} borderRadius={10} p={10} w={"90vw"}>
            <Outlet />
        </Box>
    )
}