import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import logo from "../../public/images/output-onlinepngtools (1).png"
import { TypeAnimation } from 'react-type-animation';
import Footer from "~/components/footer";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Box height={"100%"}>
      <Flex wrap={"wrap"} height={"100%"}>
        <Heading fontSize={["4xl", "6xl", "8xl"]}><TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'We Deliver Value',
            2000, // wait 1s before replacing "Mice" with "Hamsters"
            'We Deliver Joy',
            2000,
            'We Deliver Happiness',
            2000,
            'We Deliver Comfort',
            2000,
            'We Deliver Peace of Mind',
            2000,
          ]}
          wrapper="span"
          speed={1}
          style={{ fontSize: '2em', display: 'inline-block' }}
          repeat={Infinity}
        /></Heading>
      </Flex>
    </Box>
  );
}
