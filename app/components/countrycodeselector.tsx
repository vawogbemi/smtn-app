import { Flex } from "@chakra-ui/react";
import { InputControl, SelectControl } from "react-hook-form-chakra";

export default function CountryCodeSelector(props: any){
    return (
        <Flex mt={10} wrap={"wrap"}>
                    <SelectControl name="country_code" selectProps={{ placeholder: "Select option" }} label={"Country Code"} control={props.control} mr={10} w={["-moz-initial"]} onChange={()=>props.getValues('country_code') == 'other' ? props.setOther(true) : props.setOther(false)}>
                        <option value="+1">+1</option>
                        <option value="+234">+234</option>
                        <option value="other">Other</option>
                    </SelectControl>
                    {props.other &&
                        <InputControl label="Other" mt={[10, 0]} w={500} name="other" control={props.control} helperText='please add "+" in front of the number' />
                    }
                </Flex>
    )
}