import { Box, Flex } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export default function Footer() {
    return (
        <Flex w={"98%"} mt={"auto"}  mb={2.5}>
            <Box mx={"auto"}> <Link to={"mailto:vawogbemi@gmail.com?subject=Feedback"}>Made with lots of Jollof, Suya and Love ❤️</Link></Box>
        </Flex>
    )
}