import { Box, Input, Text, VStack, Button, useToast, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";
import { useTheme } from "@chakra-ui/react";
import backgroundImage from './pictures/pexels-felix-mittermeier-956999.jpg';
const { ethers } = require("ethers");


// Theme customization
const customTheme = extendTheme({
    colors: {
        brand: {
            100: "#f7fafc",
            500: "#1a202c",
            700: "#2a4365",
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: "bold",
                borderRadius: "12px", // Rounded corners for buttons
            },
            variants: {
                solid: (props) => ({
                    bg: props.colorMode === "dark" ? "brand.700" : "brand.500",
                    color: "white",
                    _hover: {
                        bg: "brand.600",
                    },
                }),
            },
        },
        Input: {
            defaultProps: {
                focusBorderColor: 'brand.500',
            },
            variants: {
                filled: {
                    field: {
                        _focus: {
                            borderColor: 'brand.500',
                        }
                    }
                }
            }
        }
    },
});



const ThreeInputsPage = () => {
    const theme = useTheme();
    const toast = useToast();
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [walletAddress, setWalletAddress] = useState([]);
    const [ticketQuantity, setTicketQuantity] = useState(1); // Default to 1 ticket
    const contractAddress = "0x52b5F63763A4861bB759F113155C6ED0C8929F49";
    const [isLoading, setIsLoading] = useState(false);
    const [isApproveForAll, setIsApproveForAll] = useState(false);



    
    useEffect(() => {

        const detectProvider = async () => {
            console.log('here1');
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


        const checkAllowance = async () => {
            console.log('here2');
            const provider = new ethers.BrowserProvider.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
    
            // ERC-721 ABI focusing on the `approve` function
            const nftAddress = '0x8E3A29E70847bcaaDB227f9913f0e404FDBA8164' // ERC-721 Contract address
            const nftABI = [
                "function getApproved(uint256 tokenId) external view returns (address)",
                "function isApprovedForAll(address owner, address operator) external view returns (bool)"
            ];
            const nftContract = new ethers.Contract(nftAddress, nftABI, signer);
            const ownerAddress = signer // The owner of the token
            const operatorAddress = contractAddress // The address you want to check for universal approval
            const isOperatorApproved = await nftContract.isApprovedForAll(ownerAddress, operatorAddress);
            setIsApproveForAll(isOperatorApproved)
            console.log(`Is the operator ${operatorAddress} approved for all tokens of ${ownerAddress}?`, isOperatorApproved);
            
        }

        detectProvider()
        checkAllowance()
    }, []);

    const approveERC721Token = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask to interact with Ethereum!');
            return;
        }
    
        try {
            // Connect to MetaMask
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            // ERC-721 ABI focusing on the `approve` and `setApprovalForAll` functions
            const abi = [
                "function approve(address to, uint256 tokenId) external",
                "function setApprovalForAll(address operator, bool _approved) external"
            ];
    
            // Create a new contract instance with signer
            const tokenContract = new ethers.Contract("0x8E3A29E70847bcaaDB227f9913f0e404FDBA8164", abi, signer);
    
            // Call the setApprovalForAll function
            const transaction = await tokenContract.setApprovalForAll(contractAddress, true);
            setIsLoading(true); // Start loading
    
            // Wait for the transaction to be mined
            const receipt = await transaction.wait();
            setIsLoading(false); // Stop loading
    
            // Notify the user of successful transaction
            console.log('Approval successful:', receipt);
            alert('Token has been successfully approved for transfer!');
            if (receipt.status === 1) {
                setIsApproveForAll(true);
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
                text: `${walletAddress} is selling ${ticketQuantity} tickets of ${input1} for ${input3} eth each`,
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
        <ChakraProvider theme={customTheme}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" backgroundImage={backgroundImage} backgroundSize="cover">
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

                        {isApproveForAll?
                        <Button
                        width="15vw"
                        borderRadius="10px"
                        onClick={sendEmail}
                        border="1px solid"
                    >
                        Send request to the buyer
                    </Button>
                    :
                    <Button onClick={approveERC721Token} disabled={isLoading} border="1px solid" borderRadius={"10px"}>
                    {isLoading ? 'Processing...' : 'Approve blockTicket to sell my tickets'}
                </Button>    
                    }
                    
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
