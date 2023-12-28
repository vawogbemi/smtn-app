import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, Flex, Icon, IconButton, Stat, StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { useForm } from "react-hook-form";
import { CheckboxSingleControl, InputControl } from "react-hook-form-chakra";
import { EMPLOYEES, getCargoBoxes, groupBy, keyToAlphabet, parseDestinationAndMethod } from "~/utils/utils";
import { Database } from "database.types";
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { useState } from "react";



export const action = async ({ request, }: ActionFunctionArgs) => {
    const body = await request.formData();

    let boxes: any[] = new Array(parseInt(body.get("boxes") as string)).fill(null).map((_, i) => i + 1)
    const paid: boolean = body.get("paid") == "undefined" ? false : true

    const response = new Response()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const employee = await supabase.auth.getUser()

    //let packages = [{}] as Array<any>
    boxes = boxes.flatMap(id => Array(1).fill({ id: id, shipment: parseInt(body.get("shipment") as string), cargo: parseInt(body.get("cargo") as string), destination: body.get("destination") as string, method: body.get("method") as string, length: parseInt(body.get("length" + id) as string), width: parseInt(body.get("width" + id) as string), height: parseInt(body.get("height" + id) as string), weight: parseInt(body.get("weight" + id) as string) }))
    const { error: boxesError } = await supabase.from("boxes").insert(boxes)//.eq("id", 13)  
    const { error: cargoError } = await supabase.from("cargo").update({ employee: employee.data.user?.id, paid: paid }).match({ shipment: parseInt(body.get("shipment") as string), id: parseInt(body.get("cargo") as string), destination: body.get("destination") as string, method: body.get("method") as string })

    if (boxesError) {
        console.log(boxesError)
    }

    if (cargoError) {
        console.log(cargoError)
    }

    //https://remix.run/docs/en/main/guides/form-validation
    //return a page with amount customer has to pay. weight will be volume weight if necessary and tabulate total amount 
    return redirect("/")
}

export default function Packages() {
    const { session, user, users, shipments, cargo } = useOutletContext<any>()

    const [boxes, setBoxes] = useState([{}]) // make it an object with properties keyed by a string of cargo details and values an array
    // Add a checkbox that filters if cargo has been interacted with or essentially has an employee id
    //if not the cargo loads all default box values -> consider naming this boxes
    //so then employees can then edit existing boxes or add values to new box

    const filteredCargo = cargo.filter((cargo: { employee: any; }) => cargo.employee == null)
    console.log(filteredCargo)
    const { handleSubmit, control } = useForm({ mode: "onBlur" })
    const submit = useSubmit()

    return (
        <Accordion>
            {Object.entries(filteredCargo).map(
                ([key, cargoDetails]) =>
                    <AccordionItem key={key}>
                        <h2>
                            <AccordionButton height={20}>
                                <Box as="span" flex='1' textAlign='left'>
                                    <Text fontSize={"2xl"}>{users.find((user: { id: any; }) => user.id == (cargoDetails as any).sender).name + " " + parseDestinationAndMethod((cargoDetails as any).destination, (cargoDetails as any).method)}</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel >
                            <Flex py={5}>
                                <Stat>
                                    <StatLabel>Box</StatLabel>
                                    <StatNumber>{(cargoDetails as any).id}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Receiver</StatLabel>
                                    <StatNumber>{(cargoDetails as any).receiver}</StatNumber>
                                </Stat>
                            </Flex>
                            <Box py={5}>
                                <Stat>
                                    <StatLabel>Description</StatLabel>
                                    <Text>{(cargoDetails as any).description}</Text>
                                </Stat>
                            </Box>
                            <Tabs>
                                <TabList>
                                    {
                                        <Flex overflow={"auto"}>
                                            {Object.entries(boxes).map(([key, box]) =>
                                                <Tab key={key} width={20}>
                                                    {keyToAlphabet(parseInt(key) + 1)}
                                                </Tab>
                                            )}
                                            <IconButton aria-label="add icon" icon={<AddIcon />} ml={"auto"} mb={1} size={"md"} onClick={() => { setBoxes([...boxes, {}]); console.log(boxes) }}></IconButton>
                                            <IconButton aria-label="delete icon" icon={<CloseIcon />} ml={1} mb={1} size={"md"} onClick={() => { setBoxes([...boxes.slice(0, -1)]); console.log(boxes) }}></IconButton>
                                        </Flex>
                                    }
                                </TabList>
                                <Form method="post" onSubmit={handleSubmit((data) => submit({ ...data, boxes: boxes.length, shipment: (cargoDetails as any).shipment, cargo: (cargoDetails as any).id, destination: (cargoDetails as any).destination, method: (cargoDetails as any).method }, {
                                    action: "",
                                    method: "post",
                                }))}>
                                    <TabPanels>

                                        {
                                            Object.entries(boxes).map(([key, box]) =>
                                                <TabPanel key={key} >
                                                    <Flex flexWrap={"wrap"}>
                                                        <Stat p={2}>
                                                            <StatLabel>Length</StatLabel>
                                                            <InputControl name={"length" + (parseInt(key) + 1)} control={control} />
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Width</StatLabel>
                                                            <InputControl name={"width" + (parseInt(key) + 1)} control={control} />
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Height</StatLabel>
                                                            <InputControl name={"height" + (parseInt(key) + 1)} control={control} />
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Weight</StatLabel>
                                                            <InputControl name={"weight" + (parseInt(key) + 1)} control={control} />
                                                        </Stat>
                                                    </Flex>
                                                </TabPanel>
                                            )
                                        }
                                    </TabPanels>
                                    <Flex mt={10} flexWrap={"wrap"}>
                                        <Stat p={5}>
                                            <StatLabel>Paid</StatLabel>
                                            <CheckboxSingleControl name="paid" control={control} />
                                        </Stat>
                                        <Button bg={"green"} color={"white"} type="submit">Submit</Button>
                                    </Flex>
                                </Form>
                            </Tabs>

                        </AccordionPanel>
                    </AccordionItem>
            )
            }
        </Accordion >
    )
}