import { ArrowRightIcon, CheckIcon, MinusIcon, RepeatIcon, SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Flex, Heading, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useToast } from "@chakra-ui/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputControl } from "react-hook-form-chakra";
import { sendSms } from "~/services/twilio.server";
import { keyToAlphabet, parseDestinationAndMethod, shipmentIdToDate } from "~/utils/utils";


export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData()

    const response = new Response()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { request, response })

    const shipment = body.get("shipment") as string
    const destination = body.get("destination") as string
    const method = body.get("method") as string
    const cargo = body.get("cargo") as string
    const box = body.get("box") as string

    if (body.get("action") == "paid") {

        const paid = JSON.parse(body.get(`paid`) as string)

        const { error } = await supabase.from("cargo").update({ paid: !paid }).match({ id: cargo, shipment: shipment, destination: destination, method: method })

        if (error) {
            return json({ error: error })
        }

    }

    if (body.get("action") == "edit") {

        const numNewBoxes = parseInt(body.get("numNewBoxes") as string)
        const numOldBoxes = parseInt(body.get("numOldBoxes") as string)


        if (numNewBoxes) {

            let boxes: any[] = new Array(numNewBoxes - numOldBoxes).fill(null).map((_, i) => i + 1 + numOldBoxes)
            boxes = boxes.flatMap(id => Array(1).fill({ id: id, shipment: shipment, cargo: cargo, destination: destination, method: method, length: parseInt(body.get(`length-${cargo}-${id}`) as string), width: parseInt(body.get(`width-${cargo}-${id}`) as string), height: parseInt(body.get(`height-${cargo}-${id}`) as string), weight: parseInt(body.get(`weight-${cargo}-${id}`) as string) }))

            console.log(boxes)
            const { error } = await supabase.from("boxes").insert(boxes)

            if (error) {
                return json({ error: error })
            }

        }

        for (let i = 1; i < numOldBoxes + 1; i++) {

            const length = parseInt(body.get(`length-${cargo}-${i}`) as string)
            const width = parseInt(body.get(`width-${cargo}-${i}`) as string)
            const height = parseInt(body.get(`height-${cargo}-${i}`) as string)
            const weight = parseInt(body.get(`weight-${cargo}-${i}`) as string)

            if (length || width || height || weight) {

                const box: { shipment: number, cargo: number, destination: string, method: string, id: number, length?: number, width?: number, height?: number, weight?: number } = { shipment: parseInt(shipment), cargo: parseInt(cargo), destination: destination, method: method, id: i }

                length ? box.length = length : void (0)
                width ? box.width = width : void (0)
                height ? box.height = height : void (0)
                weight ? box.weight = weight : void (0)

                const { error } = await supabase.from("boxes").update(box).match({ id: i, cargo: cargo, shipment: shipment, destination: destination, method: method })

                if (error) {
                    return json({ error: error })
                }
            }
        }


        //const { error: boxesError } = await supabase.from("boxes").insert(boxes)    
    }

    if (body.get("action") == "delete") {

        if (box) {

            const { error } = await supabase.from("boxes").delete().match({ id: box, cargo: cargo, shipment: shipment, destination: destination, method: method })

            if (error) {
                return json(error)
            }

        } else {

            const { error } = await supabase.from("cargo").delete().match({ id: cargo, shipment: shipment, destination: destination, method: method })

            if (error) {
                return json(error)
            }

        }

    }

    if (body.get("action") == "status") {

        const status = parseInt(body.get("status") as string)

        if (status == 4) {
            sendSms({
                from: "+15185030491",
                to: "+16476675845",
                body: "hi this is your biggest fan"
            })
        }

        const { error } = await supabase.from("shipments").update({ status: status }).match({ id: shipment, destination: destination, method: method })

        if (error) {
            return json(error)
        }
    }

    return json({ success: true })
}

export async function loader({
    params,
}: LoaderFunctionArgs) {


    return json(
        {
            id: params.id,
            destination: params.destination,
            method: params.method,
        }
    )
}

const steps = [
    { title: 'Created', description: 'Contact Info' },
    { title: 'In Transit', description: 'Date & Time' },
    { title: 'Received', description: 'Select Rooms' },
    { title: 'Picked Up', description: 'Select Rooms' },
]

export default function Shipments() {


    const { id, destination, method } = useLoaderData<typeof loader>()

    //Outlet Context
    const { session, user, users, shipments, cargo, boxes } = useOutletContext<any>()
    const shipment = shipments ? shipments.filter((shipment: { id: string | undefined; destination: string | undefined; method: string | undefined; }) => shipment.id == id && shipment.destination == destination && shipment.method == method) : []

    //Filtered stuff
    const filteredCargo = cargo ? cargo.filter((cargo: { shipment: string | undefined; destination: string | undefined; method: string | undefined; }) => cargo.shipment == id && cargo.destination == destination && cargo.method == method) : []
    const filteredBoxes = boxes ? boxes.filter((boxes: { shipment: string | undefined; destination: string | undefined; method: string | undefined; }) => boxes.shipment == id && boxes.destination == destination && boxes.method == method) : []

    //STATES

    //cargoNum
    const [cargoNum, setcargoNum] = useState(0)

    //cargo 
   

    //box
    const [newBoxes, setNewBoxes] = useState(Array<any>)
    const [numOldBoxes, setNumOldBoxes] = useState(0)
    const [numNewBoxes, setNumNewBoxes] = useState(0)

    //edit states
    const [edit, setEdit] = useState(false)
    const toggleEdit = () => setEdit(!edit)

    //form stuff
    const { handleSubmit, control, reset, resetField } = useForm({ mode: "onBlur" })
    const submit = useSubmit()


    //form stuff after action is done
    const actionData = useActionData<typeof action>();

    const toast = useToast()

    const phoneNumbers: string[] = []

    const x = filteredCargo.flatMap((cargo: any) => `${cargo.receiver_country_code}${cargo.receiver_phone}`)

    console.log(newBoxes)

    useEffect(() => {
        //@ts-ignore
        actionData?.error ?
            toast({
                title: 'Something went wrong.',
                description: ``,
                status: 'error',
                duration: 5000,
                isClosable: true,
            }) :
            //@ts-ignore
            actionData?.success ?
                (toast({
                    title: 'Success',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                }), reset({}), setNewBoxes([])) : null
    }, [actionData])

    //TODO
    // Add Popover to send and receiver -- DONE
    // Make Hovering over Box or Box letter bring tool tip for description -- DONE
    // Changed Paid to status that indicates if it was picked up too, add a new column in cargo for pick up 
    // When adding a new box to a different cargo, make sure they are filtered, and when submitting the number of new boxes make sure they are filtered to the specific cargo -- DONE
    return (
        shipment.length ?
            <Box>
                <Flex wrap={"wrap"} py={5}>
                    <Heading mb={5}>{`${shipmentIdToDate(id!)}, ${parseDestinationAndMethod(destination!, method!)}`}</Heading>
                    <Box ml={"auto"}>
                        <Button onClick={() => toggleEdit()} mr={5}>Edit</Button>
                        <Button mr={5}>Print Labels</Button>
                        <Button mr={5}>Print Manifest</Button>
                        <Button onClick={() => {

                        }}>Send Message</Button>
                    </Box>
                </Flex>
                <Stepper index={shipment.at(0).status} flexWrap={"wrap"} mb={10}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>

                            <Box >
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                    <IconButton aria-label="arrow right" icon={<ArrowRightIcon />} ml={5} colorScheme="teal" size={"lg"} onClick={() => submit({ action: "status", shipment: id!, destination: destination!, method: method!, status: shipment.at(0).status + 1 },
                        {
                            action: "",
                            method: "post",
                        })}></IconButton>
                </Stepper>
                <Form method="post" onSubmit={handleSubmit((data) => submit({ ...data, action: "edit", numNewBoxes: numNewBoxes, numOldBoxes: numOldBoxes, shipment: id!, cargo: cargoNum, destination: destination!, method: method! }, {
                    action: "",
                    method: "post",
                }))}>
                    <TableContainer>
                        <Table variant='striped'>
                            <Thead>
                                <Tr>
                                    <Th>Box</Th>
                                    <Th>Box Letter</Th>
                                    <Th>Sender</Th>
                                    <Th>Receiver</Th>
                                    <Th>Paid</Th>
                                    <Th>Length</Th>
                                    <Th>Width</Th>
                                    <Th>Height</Th>
                                    <Th>Weight</Th>
                                    {
                                        edit &&
                                        <Th></Th>
                                    }
                                </Tr>
                            </Thead>

                            <Tbody>

                                {
                                    filteredCargo.map(
                                        (cargo: any) => (
                                            <>
                                                <Tr>
                                                    <Td><Tooltip label={`Description: ${cargo.description}`}><b>{cargo.id}</b></Tooltip></Td>
                                                    <Td></Td>
                                                    <Td>
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <Button bg={"white.50"}>{users.find((user: any) => user.id = cargo.sender).name}</Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent color='black' bg='white' borderColor='white' width={"fit-content"} height={"fit-content"}>
                                                                <PopoverArrow bg='white' />
                                                                <PopoverCloseButton />
                                                                <PopoverHeader pt={4} fontWeight='bold' border='0'>{users.find((user: any) => user.id = cargo.sender).name}</PopoverHeader>
                                                                <PopoverBody fontWeight='bold'>
                                                                    {`Country Code: ${users.find((user: any) => user.id = cargo.sender).country_code} Phone: ${users.find((user: any) => user.id = cargo.sender).phone} `}
                                                                    <br />
                                                                    {`Email: ${users.find((user: any) => user.id = cargo.sender).email}`}
                                                                    <br />
                                                                    {`Address: ${users.find((user: any) => user.id = cargo.sender).address}`}
                                                                    <br />
                                                                    {`Country: ${users.find((user: any) => user.id = cargo.sender).country}`}
                                                                    <br />
                                                                    {`City: ${users.find((user: any) => user.id = cargo.sender).city}`}
                                                                    <br />
                                                                    {`Postal / Zip Code: ${users.find((user: any) => user.id = cargo.sender).postal_zip_code}`}
                                                                </PopoverBody>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Td>
                                                    <Td>
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <Button bg={"white.50"}>{cargo.receiver_name}</Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent color='black' bg='white' borderColor='white' width={"fit-content"} height={"fit-content"}>
                                                                <PopoverArrow bg='white' />
                                                                <PopoverCloseButton />
                                                                <PopoverHeader pt={4} fontWeight='bold' border='0'>{cargo.receiver_name}</PopoverHeader>
                                                                <PopoverBody fontWeight='bold'>
                                                                    {`Phone Number: ${cargo.receiver_phone}`}
                                                                </PopoverBody>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Td>
                                                    <Td>
                                                        <Badge colorScheme={cargo.paid ? "green" : "red"} ml={2}>{cargo.paid ? "paid" : "not paid"}</Badge>
                                                        {
                                                            edit ? <IconButton aria-label="switch" ml={5} icon={<RepeatIcon />} bg={"green.300"} color={"white"} border={"2px"} borderColor={"green.300"} _hover={{ color: "green.300", bg: "white" }} onClick={() => submit({ action: "paid", shipment: id!, destination: destination!, method: method!, cargo: cargo.id, paid: cargo.paid },
                                                                {
                                                                    action: "",
                                                                    method: "post",
                                                                })}>toggle</IconButton> : <></>}
                                                    </Td>
                                                    <Td></Td>
                                                    <Td></Td>
                                                    <Td></Td>
                                                    <Td></Td>
                                                    {
                                                        edit &&
                                                        <Td>
                                                            <IconButton aria-label="delete" icon={<MinusIcon />} bg={"red.400"} border={"2px"} color={"white"} borderRadius={50} borderColor={"red.400"} mr={5} _hover={{ bg: "white", color: "red.400" }} onClick={() => submit({ action: "delete", shipment: id!, destination: destination!, method: method!, cargo: cargo.id }, {
                                                                action: "",
                                                                method: "post",
                                                            })}></IconButton>
                                                        </Td>
                                                    }

                                                </Tr>
                                                {
                                                    filteredBoxes.filter((boxes: { cargo: any }) => boxes.cargo == cargo.id).map((box: any) =>
                                                        <Tr>
                                                            <Td></Td>
                                                            <Td><Tooltip label={`Description: ${cargo.description}`}><b>{keyToAlphabet(box.id)}</b></Tooltip></Td>
                                                            <Td></Td>
                                                            <Td></Td>
                                                            <Td></Td>
                                                            <Td>{edit ? <InputControl name={`length-${cargo.id}-${box.id}`} control={control} inputProps={{ placeholder: box.length }} w={"20"}></InputControl> : box.length}</Td>
                                                            <Td>{edit ? <InputControl name={`width-${cargo.id}-${box.id}`} control={control} inputProps={{ placeholder: box.width }} w={"20"}></InputControl> : box.width}</Td>
                                                            <Td>{edit ? <InputControl name={`height-${cargo.id}-${box.id}`} control={control} inputProps={{ placeholder: box.height }} w={"20"}></InputControl> : box.height}</Td>
                                                            <Td>{edit ? <InputControl name={`weight-${cargo.id}-${box.id}`} control={control} inputProps={{ placeholder: box.weight }} w={"20"}></InputControl> : box.weight}</Td>
                                                            {edit &&
                                                                <Td><IconButton aria-label="delete" icon={<MinusIcon />} bg={"red.400"} border={"2px"} borderColor={"red.400"} color={"white"} borderRadius={50} _hover={{ bg: "white", color: "red.500" }} onClick={() => submit({ action: "delete", shipment: id!, destination: destination!, method: method!, cargo: cargo.id, box: box.id }, {
                                                                    action: "",
                                                                    method: "post",
                                                                })}></IconButton></Td>
                                                            }
                                                        </Tr>)
                                                }
                                                {
                                                    edit &&
                                                    newBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).map((box: any) =>
                                                        <Tr>
                                                            <Td></Td>
                                                            <Td><Tooltip label={`Description: ${cargo.description}`}><b>{keyToAlphabet(box.id)}</b></Tooltip></Td>
                                                            <Td></Td>
                                                            <Td></Td>
                                                            <Td></Td>
                                                            <Td><InputControl name={`length-${cargo.id}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                                            <Td><InputControl name={`width-${cargo.id}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                                            <Td><InputControl name={`height-${cargo.id}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                                            <Td><InputControl name={`weight-${cargo.id}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                                            <Td></Td>
                                                        </Tr>)
                                                }
                                                {
                                                    edit &&
                                                    <Tr>
                                                        <Td></Td>
                                                        <Td></Td>
                                                        <Td></Td>
                                                        <Td></Td>
                                                        <Td></Td>
                                                        <Td></Td>
                                                        <Td></Td>
                                                        <Td><IconButton aria-label="add" bg={"white.50"} icon={<SmallAddIcon />} onClick={() => {
                                                            setNewBoxes([...newBoxes, {
                                                                cargo: cargo.id, id: newBoxes.filter((boxes: { cargo: any }) => boxes.cargo == cargo.id).length
                                                                    ? newBoxes.filter((boxes: { cargo: any }) => boxes.cargo == cargo.id).at(-1).id + 1
                                                                    : filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).length
                                                                        ? filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).at(-1).id + 1
                                                                        : 1
                                                            }])
                                                        }}></IconButton></Td>
                                                        <Td><IconButton aria-label="delete" bg={"white.50"} onClick={() => { resetField(`length-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`width-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`height-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`weight-${cargo.id}-${newBoxes.at(-1).id}`); setNewBoxes([...newBoxes.slice(0, -1)]) }} icon={<SmallCloseIcon />}></IconButton></Td>
                                                        <Td><IconButton type="submit" aria-label="submit" bg={"green.400"} border={"2px"} color={"white"} borderRadius={50} borderColor={"green.400"} _hover={{ bg: "white", color: "green.400" }} onClick={() => { newBoxes.length ? setNumNewBoxes(newBoxes.filter((boxes: { cargo: any }) => boxes.cargo == cargo.id).at(-1).id) : null; setNumOldBoxes(filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).length ? filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).at(-1).id : 0); setcargoNum(parseInt(cargo.id)) }} icon={<CheckIcon />}></IconButton></Td>
                                                    </Tr>
                                                }

                                            </>
                                        )
                                    )
                                }

                            </Tbody>
                        </Table>
                    </TableContainer>
                </Form>

            </Box>
            : <Text>Something went wrong. Shipment doesn't exist :c</Text>
    )
}

//resetField(`length-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`width-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`height-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`weight-${cargo.id}-${newBoxes.at(-1).id}`);
//aria-label="add" onClick={() => { newCargo.length ? null : setNewCargo([...newCargo, { id: newCargo.length ? newCargo.at(-1).id + 1 : filteredCargo.at(-1).id + 1 }]) }} 
//setNumBoxes(newBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).length ? newBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).at(-1).id : filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).at(-1).id)

//NEW CARGO IN ACTION

/*
const newCargo = parseInt(body.get("newCargo") as string)

if (newCargo){

    const sender_name = body.get("sender_name") as string
    const sender_phone = body.get("sender_phone") as string

    //const { error } = await supabase.from("cargo").insert({ id: newCargo, shipment: shipment, destination: destination, method: method })

}
*/

// NEW CARGO IMPLEMENTATION
/*
 {
                                    edit &&
                                    newCargo != 0 &&
                                    <Tr>
                                        <Td><b>{newCargo}</b></Td>
                                        <Td></Td>
                                        <Td><InputControl name={`sender_name`} control={control} helperText={"Sender Name"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                        <Td><InputControl name={`sender_number`} control={control} helperText={"Sender Phone Number"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                    </Tr>



                                }
                                {
                                    edit &&
                                    newCargo != 0 &&
                                    newBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == newCargo).map((box: any) =>
                                        <Tr>
                                            <Td></Td>
                                            <Td><Tooltip label={`Description: ${cargo.description}`}><b>{keyToAlphabet(box.id)}</b></Tooltip></Td>
                                            <Td></Td>
                                            <Td></Td>
                                            <Td></Td>
                                            <Td><InputControl name={`length-${newCargo}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                            <Td><InputControl name={`width-${newCargo}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                            <Td><InputControl name={`height-${newCargo}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                            <Td><InputControl name={`weight-${newCargo}-${box.id}`} control={control} placeholder={box.length} w={"20"} bg={"white"} inputProps={{ isRequired: true }}></InputControl></Td>
                                            <Td></Td>
                                        </Tr>)
                                }
                                {
                                    edit &&
                                    newCargo != 0 &&
                                    <Tr>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td><IconButton aria-label="add" bg={"white.50"} icon={<SmallAddIcon />} onClick={() => {
                                            setNewBoxes([...newBoxes, {
                                                cargo: newCargo, id: newBoxes.filter((boxes: { cargo: any }) => boxes.cargo == newCargo).length
                                                    ? newBoxes.filter((boxes: { cargo: any }) => boxes.cargo == newCargo).at(-1).id + 1
                                                    : filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == newCargo).length
                                                        ? filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == newCargo).at(-1).id + 1
                                                        : 1
                                            }])
                                        }}></IconButton></Td>
                                        <Td><IconButton aria-label="delete" bg={"white.50"} onClick={() => { resetField(`length-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`width-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`height-${cargo.id}-${newBoxes.at(-1).id}`); resetField(`weight-${cargo.id}-${newBoxes.at(-1).id}`); setNewBoxes([...newBoxes.slice(0, -1)]) }} icon={<SmallCloseIcon />}></IconButton></Td>
                                        <Td><IconButton type="submit" aria-label="submit" bg={"green.400"} border={"2px"} color={"white"} borderRadius={50} borderColor={"green.400"} _hover={{ bg: "white", color: "green.400" }} onClick={() => { newBoxes.length ? setNumNewBoxes(newBoxes.filter((boxes: { cargo: any }) => boxes.cargo == cargo.id).at(-1).id) : null; setNumOldBoxes(filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).length ? filteredBoxes.filter((boxes: { cargo: any; }) => boxes.cargo == cargo.id).at(-1).id : 0); setcargoNum(parseInt(cargo.id)) }} icon={<CheckIcon />}></IconButton></Td>
                                    </Tr>
                                }
                                {
                                    edit &&
                                    <Tr>
                                        <Td><IconButton aria-label="add" onClick={() => setNewCargo(filteredCargo.at(-1).id + 1)} icon={<SmallAddIcon />}></IconButton></Td>
                                        <Td><IconButton aria-label="delete" onClick={() => { setNewCargo(0) }} icon={<SmallCloseIcon />}></IconButton></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                    </Tr>
                                }*/