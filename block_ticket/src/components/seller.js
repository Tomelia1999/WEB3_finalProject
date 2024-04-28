import { Box, Input, Text, VStack, Button, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";
import { useTheme } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import backgroundImage from './pictures/pexels-felix-mittermeier-956999.jpg';
const { ethers } = require("ethers");




const ThreeInputsPage = () => {
    const theme = useTheme();
    const toast = useToast();
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [walletAddress, setWalletAddress] = useState([]);
    const [ticketQuantity, setTicketQuantity] = useState(1); // Default to 1 ticket
    const contractAddress = "0x52b5F63763A4861bB759F113155C6ED0C8929F49";



    useEffect(() => {
        const detectProvider = async () => {
            const provider = await detectEthereumProvider();
            if (provider) {
                // MetaMask is installed and available
                console.log("MetaMask is installed and available:", provider);
                // Retrieve the connected wallet's address
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    // Set the wallet address state
                    setWalletAddress(accounts[0]);
                } else {
                    console.log("No accounts connected");
                }
            } else {
                // MetaMask is not installed or not available
                console.log("MetaMask is not installed or not available");
            }
        };

        const checkAllowence = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
    
            // ERC-721 ABI focusing on the `approve` function
            const nftAddress = '0xd3a03A1e3c11D56098fA9B0e7691fF3Ef47DCd2A' // ERC-721 Contract address
            const nftABI = [
                "function getApproved(uint256 tokenId) external view returns (address)",
                "function isApprovedForAll(address owner, address operator) external view returns (bool)"
            ];
            const nftContract = new ethers.Contract(nftAddress, nftABI, signer);
            const ownerAddress = '0x4524774349C16bF698e7752DAe0B57336C7B508E' // The owner of the token
            const operatorAddress = contractAddress // The address you want to check for universal approval
            const isOperatorApproved = await nftContract.isApprovedForAll(ownerAddress, operatorAddress);
            console.log(`Is the operator ${operatorAddress} approved for all tokens of ${ownerAddress}?`, isOperatorApproved);
            
        }

        detectProvider();
        checkAllowence()
    }, []);

    const approveERC721Token = async (tokenId, toAddress) => {
        // Check if Ethereum object and MetaMask are available
        if (!window.ethereum) {
            alert('Please install MetaMask to interact with Ethereum!');
            return;
        }
    
        try {
            // Connect to MetaMask
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
    
            // ERC-721 ABI focusing on the `approve` function
            const abi = [
                "function approve(address to, uint256 tokenId) external",
                "function setApprovalForAll(address operator, bool _approved) external"
            ];
    
            // Create a new contract instance with signer
            const tokenContract = new ethers.Contract("0xd3a03A1e3c11D56098fA9B0e7691fF3Ef47DCd2A", abi, signer);
    
            // Call the approve function
            const transaction = await tokenContract.setApprovalForAll(contractAddress, true);
    
            // Wait for the transaction to be mined
            const receipt = await transaction.wait();
    
            // Notify the user of successful transaction
            console.log('Approval successful:', receipt);
            alert('Token has been successfully approved for transfer!');
            if(receipt.hash){
                sendEmail()
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to approve token: ' + error.message);
        }
    };

    const sendEmail = async () => {
        const input1 = document.getElementById("input1").value;
        const input2 = document.getElementById("input2").value;
        const input3 = document.getElementById("input3").value;
    
        try {
            const response = await axios.post("http://localhost:3000/send-email", {
                recipient: input2,
                subject: "New ticket offer",
                text: `${walletAddress} is selling ${ticketQuantity} tickets of ${input1} for ${input3} dollars each`,
                url: `http://localhost:3001/buyer/${encodeURIComponent(
                    `${walletAddress},${input1},${ticketQuantity},${input3}`
                )}`,
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
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Wallet connected successfully");
            // Retrieve the connected wallet's address
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                // Set the wallet address state
                setWalletAddress(accounts[0]);
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
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
            {" "}
            {/* Added ChakraProvider */}
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
                {walletAddress.length > 0 ? (
                    <VStack
                        spacing={4}
                        p={8}
                        bg="whiteAlpha.900"
                        boxShadow="xl"
                        border="1px solid"
                        height="40vh"
                        borderRadius="10px"
                        centerContent
                    >
                        <Text fontSize="2xl" fontWeight="bold">
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
                        {walletAddress && (
                            <Text mt={2}>Connected Wallet Address: {walletAddress}</Text>
                        )}
                        <Input
                            id="input4"
                            placeholder="Number of Tickets"
                            variant="filled"
                            mb={4}
                            type="number" // Ensures that only numbers can be entered
                            value={ticketQuantity}
                            onChange={(e) => setTicketQuantity(e.target.value)}
                            border="1px solid"
                        />


                        <Button
                            width="15vw"
                            borderRadius="10px"
                            onClick={approveERC721Token}
                            border="1px solid"
                        >
                            Send
                        </Button>
                    </VStack>
                ) : (
                    <Button
                        width="15vw"
                        borderRadius="10px"
                        onClick={handleConnectWallet}
                        border="1px solid"
                    >
                        <Text overflow={"auto"}>Connect MetaMask Wallet</Text>
                    </Button>
                )}
            </Box>
        </ChakraProvider>
    );
};

export default ThreeInputsPage;
