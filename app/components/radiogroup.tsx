import { Box, useRadio } from "@chakra-ui/react"

export default function RadioCard(props: any) {
    const { getInputProps, getRadioProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Box as='label' mx={"auto"}>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: '#4299E1',
            color: 'white',
            borderColor: '#4299E1',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          w={[300, 400, 600, 500]}
          height={100}
          my={[5, 2, 2, 2, 2, 0]}
          py={["5vh","3vh"]}
          textAlign={"center"}
        >
          {props.children}
        </Box>
      </Box>
    )
  }