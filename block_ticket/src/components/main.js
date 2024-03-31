import { Box, ChakraProvider, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';


import { useTheme } from "@chakra-ui/react";
import backgroundImage from "./pictures/pexels-felix-mittermeier-956999.jpg"; // Import the image

const MainPage = () => {
    const theme = useTheme();
    const navigate = useNavigate(); // Use the useNavigate hook

    const navigateToSeller = () => {
        navigate('/seller'); // Use the 'navigate' function to navigate
    };

    return (
        <ChakraProvider theme={theme}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                width="100vw"
                position="fixed"
                top="0"
                left="0"
                backgroundImage={`url(${backgroundImage})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                flexDirection={"row"}
            >
                <Flex
                    border="1px solid"
                    backgroundColor={"white"}
                    height={"60vh"}
                    width="30vw"
                    opacity={"0.6"}
                    borderRadius={"10px"}
                    m={30}
                    textAlign={"left"}
                    justifyContent="center"
                >
                    <Flex width="80%" mt="8%" alignItems="center" flexDirection={"column"}>
                    <Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.800">Seller's Lounge</Text>
                        <Text>
                        Got tickets? Want cash? Welcome to BlockTicket's Seller's Lounge, where selling your tickets is as easy as pie—easier, actually, since pie can get pretty complicated. List your tickets, name your price, and kick back. Our blockchain magic handles the rest, making sure your sales are smoother than a jazz concert on a lazy Sunday afternoon. Say goodbye to the hassle and hello to a hassle-free selling spree!
                        </Text>
                        <Flex
                            _hover={{ width: "60%",
                        height:"13%" }}
                            cursor="pointer"
                            backgroundColor={"gray"}
                            height={"10%"}
                            width={"50%"}
                            marginTop={"24%"}
                            borderRadius={"10px"}
                            alignItems="center"
                            justifyContent={"center"}
                            color={"white"}
                            onClick={navigateToSeller} // Add this line for navigation
                        >
                            I want to sell
                        </Flex>
                    </Flex>
                </Flex>
                <Flex
                    border="1px solid"
                    backgroundColor={"white"}
                    height={"60vh"}
                    width="30vw"
                    opacity={"0.6"}
                    borderRadius={"10px"}
                    m={30}
                    textAlign={"left"}
                    justifyContent="center"
                >
                    <Flex width="80%" mt="8%" alignItems="center" flexDirection={"column"}>
                    <Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.800">Buyer's Bonanza</Text>

                        <Text>
                            On the hunt for tickets without the drama? Welcome to BlockTicket's
                            Buyer's Bonanza, where snagging tickets is as secure as Fort Knox but
                            way more fun. Dive into a sea of options, find your perfect event, and
                            let our blockchain wizardry secure your purchase. It's like having a
                            backstage pass to the world of hassle-free buying. Get ready to wave
                            goodbye to counterfeits and hello to a world where buying tickets is as
                            joyful as the events themselves!
                        </Text>
                        <Flex
                            _hover={{ width: "60%",
                        height:"13%" }}
                            cursor="pointer"
                            backgroundColor={"gray"}
                            height={"10%"}
                            width={"50%"}
                            marginTop={"10%"}
                            borderRadius={"10px"}
                            alignItems="center"
                            justifyContent={"center"}
                            color={"white"}
                        >
                            I want to buy
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </ChakraProvider>
    );
};

export default MainPage;
