import { Box, Input, Text, VStack, Button, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { detectEthereumProvider } from '@metamask/detect-provider';
import { useTheme } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";

const ThreeInputsPage = () => {
    const theme = useTheme();
    const toast = useToast(); // Using Chakra UI's toast for notifications

    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null); // State to store wallet address

    useEffect(() => {
        const detectProvider = async () => {
            const provider = await detectEthereumProvider();
            if (provider) {
                // MetaMask is installed and available
                console.log('MetaMask is installed and available:', provider);
                // Retrieve the connected wallet's address
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    // Set the wallet address state
                    setWalletAddress(accounts[0]);
                }
            } else {
                // MetaMask is not installed or not available
                console.log('MetaMask is not installed or not available');
            }
        };

        detectProvider();
    }, []);

    const sendEmail = async () => {
        const input1 = document.getElementById("input1").value;
        const input2 = document.getElementById("input2").value;
        const input3 = document.getElementById("input3").value;

        try {
            const response = await axios.post("http://localhost:3000/send-email", {
                recipient: input2,
                subject: "New ticket offer",
                text: `${walletAddress} is selling ${input1} for ${input3} dollars`,
            });

            if (response.status === 200) {
                setEmailSent(true);
                setEmailError(false);
                toast({
                    title: "Email Sent",
                    description: "Your email was sent successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setEmailError(true);
            setEmailSent(false);
            toast({
                title: "Error",
                description: "There was an error sending your email. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleConnectWallet = async () => {
        try {
            // Request connection to MetaMask wallet
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Wallet connected successfully');
            // Retrieve the connected wallet's address
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // Set the wallet address state
                setWalletAddress(accounts[0]);
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            toast({
                title: "Error",
                description: "There was an error connecting your wallet. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <ChakraProvider theme={theme}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                alignContent={"center"}
                height="100vh"
            >
                <VStack
                    spacing={4}
                    p={8}
                    bg="whiteAlpha.900" // Light background for the form area
                    boxShadow="xl" // Shadow for a subtle "lifted" look
                    border="1px solid"
                    height={"40vh"}
                    borderRadius="10px"
                >
                    <Text fontSize="2xl" fontWeight="bold" mt={"20%"}>
                        Sell Your Tickets
                    </Text>
                    <Input
                        id="input1"
                        placeholder="Enter Ticket Address"
                        variant="filled"
                        mb={2}
                        border="1px solid"
                    />
                    <Input
                        id="input2"
                        placeholder="Enter an Email"
                        variant="filled"
                        mb={2}
                        border="1px solid"
                    />
                    <Input
                        id="input3"
                        placeholder="Enter the price"
                        variant="filled"
                        mb={4}
                        border="1px solid"
                    />
                    <Button
                        border="1px solid"
                        width="15vw"
                        borderRadius={"10px"}
                        onClick={handleConnectWallet} // Connect wallet button click handler
                    >
                        Connect MetaMask Wallet
                    </Button>
                    <Button
                        border="1px solid"
                        width="15vw"
                        borderRadius={"10px"}
                        onClick={sendEmail}
                    >
                        Send
                    </Button>
                    {walletAddress && (
                        <Text mt={2}>Connected Wallet Address: {walletAddress}</Text>
                    )}
                </VStack>
            </Box>
        </ChakraProvider>
    );
};

export default ThreeInputsPage;
