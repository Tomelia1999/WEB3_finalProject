import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Text, VStack, Box, ChakraProvider, useToast, Input, extendTheme } from '@chakra-ui/react';
import detectEthereumProvider from '@metamask/detect-provider';
import backgroundImage from './pictures/pexels-felix-mittermeier-956999.jpg';
const { ethers } = require("ethers");


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
                borderRadius: "12px",
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



const BuyerDetailsPage = () => {
    const { sellerDetails } = useParams();
    const decodedSellerDetails = decodeURIComponent(sellerDetails).split(',');
    const navigate = useNavigate();
    const toast = useToast();
    const [buyerAddress, setBuyerAddress] = useState(null);

    useEffect(() => {
        const detectProvider = async () => {
            const provider = await detectEthereumProvider();
            if (provider) {
                console.log('MetaMask is installed and available:', provider);
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setBuyerAddress(accounts[0]);
                }
            } else {
                console.log('MetaMask is not installed or not available');
            }
        };
        detectProvider();
    }, []);

    const connectWallet = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setBuyerAddress(accounts[0]);
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
    const confirmTransaction = async () => {
        if (!window.ethereum) {
            toast({
                title: "Error",
                description: "Please install MetaMask!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    
        console.log("provider:", provider);
    
        const contractAddress = "0x52b5F63763A4861bB759F113155C6ED0C8929F49";
        const abi = [
            "function tradeTokens(address tokenAddress, address seller, address buyer, uint256 tokenAmount, uint256 paymentAmount) payable"
        ];
    
        const tokenTradeContract = new ethers.Contract(contractAddress, abi, signer);
    
        const tokenAddress = decodedSellerDetails[1];
        const seller = decodedSellerDetails[0]; // Seller's address
        const numberOfTickets = decodedSellerDetails[2];
        const paymentAmount = ethers.utils.parseUnits("0.01", "ether"); // Payment amount in ether
    
        console.log('seller : ', seller);
        console.log('token address : ', tokenAddress);
        console.log('tickets amount : ', numberOfTickets);
        console.log('payment amount : ', paymentAmount);
    
        try {
            const transactionOptions = {
                value: paymentAmount, // This is the ETH amount sent with the transaction
                gasPrice: ethers.utils.parseUnits("2", "gwei"), // Gas price in gwei
                gasLimit: 21000000 // A standard gas limit for token transfers
            };
            
            const tx = await tokenTradeContract.tradeTokens(
                tokenAddress,
                seller,
                buyerAddress,
                numberOfTickets,
                paymentAmount,
                transactionOptions
            );
            console.log('Transaction submitted:', tx.hash);
    
            // Wait for the transaction to be confirmed
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
    
            // Notify user of successful transaction
            toast({
                title: "Success",
                description: "Transaction successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Transaction failed:', error);
            toast({
                title: "Transaction Failed",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    

    return (
        <ChakraProvider theme={customTheme}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" backgroundImage={backgroundImage} backgroundSize="cover">
                <VStack spacing={4} p={8} bg="whiteAlpha.900" boxShadow="xl" border="1px solid" borderRadius="10px">
                    <Text fontSize="2xl" fontWeight="bold">Transaction Details</Text>
                    <Text>Seller Wallet Address: {decodedSellerDetails[0]}</Text>
                    <Text>Ticket: {decodedSellerDetails[1]}</Text>
                    <Text>Price: {decodedSellerDetails[3]}</Text>
                    {buyerAddress ? (
                        <>
                            <Text>Buyer Wallet Address: {buyerAddress}</Text>
                            <Button width="15vw" borderRadius="10px" colorScheme="green" onClick={confirmTransaction}>
                                Confirm Transaction
                            </Button>
                        </>
                    ) : (
                        <Button width="15vw" borderRadius="10px" colorScheme="blue" onClick={connectWallet}>
                            Connect Wallet
                        </Button>
                    )}
                </VStack>
            </Box>
        </ChakraProvider>
    );
};

export default BuyerDetailsPage;