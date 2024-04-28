import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Text, VStack, Box, ChakraProvider, useToast } from '@chakra-ui/react';
import detectEthereumProvider from '@metamask/detect-provider';
const { ethers } = require("ethers");

const BuyerDetailsPage = () => {
    const { sellerDetails } = useParams();
    const decodedSellerDetails = decodeURIComponent(sellerDetails).split(',');
    const navigate = useNavigate();
    const toast = useToast();
    const contractAddress = '0x52b5F63763A4861bB759F113155C6ED0C8929F49';

    const [buyerAddress, setBuyerAddress] = useState(null);

    useEffect(() => {
        const detectProvider = async () => {
            const provider = await detectEthereumProvider();
            if (provider) {
                // MetaMask is installed and available
                console.log('MetaMask is installed and available:', provider);
                // Retrieve the connected wallet's address
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    // Set the buyer's wallet address state
                    setBuyerAddress(accounts[0]);
                }
            } else {
                // MetaMask is not installed or not available
                console.log('MetaMask is not installed or not available');
            }
        };

        detectProvider();
    }, []);

    const connectWallet = async () => {
        try {
            // Request connection to MetaMask wallet
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Wallet connected successfully');
            // Retrieve the connected wallet's address
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // Set the buyer's wallet address state
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
    
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        console.log("provider:", provider)

        const contractAddress = "0x52b5F63763A4861bB759F113155C6ED0C8929F49";
        const abi = [
            "function tradeTokens(address tokenAddress, address seller, address buyer, uint256 tokenAmount, uint256 paymentAmount) payable"
        ];
    
        const tokenTradeContract = new ethers.Contract(contractAddress, abi, signer);

       // const symbol = await tokenTradeContract.symbol()
       // console.log("symbol is:", symbol)
    
        const tokenAddress = decodedSellerDetails[1];
        const seller = decodedSellerDetails[0]; // Seller's address
        const numberOfTickets = decodedSellerDetails[2];
        const paymentAmount = ethers.parseUnits("0.01", 18);; // Payment amount in ether

        console.log('seller : ', seller);
        console.log('token address : ', tokenAddress);
        console.log('tickets amount : ', numberOfTickets);
        console.log('payment amount : ', paymentAmount);
    
        try {
            const transactionOptions = {
                value: paymentAmount, // This is the ETH amount sent with the transaction
                gasPrice: ethers.parseUnits("10", "gwei"), // Gas price in gwei
                gasLimit: 1000000 // A standard gas limit for token transfers
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
        <ChakraProvider>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                height="100vh"
            >
                <VStack
                    spacing={4}
                    p={8}
                    bg="white"
                    boxShadow="xl"
                    border="1px solid"
                    height="40vh"
                    borderRadius="10px"
                    alignItems="center"
                >
                    <Text fontSize="2xl" fontWeight="bold">
                        Transaction Details
                    </Text>
                    <Text>Seller Wallet Address: {decodedSellerDetails[0]}</Text>
                    <Text>Ticket: {decodedSellerDetails[1]}</Text>
                    <Text>Price: {decodedSellerDetails[3]}</Text>
                    {buyerAddress && <Text>Buyer Wallet Address: {buyerAddress}</Text>}
                    <Button
                        width="15vw"
                        borderRadius="10px"
                        onClick={connectWallet}
                        colorScheme="blue"
                    >
                        Connect Wallet
                    </Button>
                    <Button
                        width="15vw"
                        borderRadius="10px"
                        onClick={confirmTransaction}
                        colorScheme="green"
                    >
                        Confirm Transaction
                    </Button>
                </VStack>
            </Box>
        </ChakraProvider>
    );
};

export default BuyerDetailsPage;
