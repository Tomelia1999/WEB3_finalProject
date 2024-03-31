import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Text, VStack, Box, ChakraProvider, useToast } from '@chakra-ui/react';
import { detectEthereumProvider } from '@metamask/detect-provider';

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

    const confirmTransaction = () => {
        console.log('Transaction confirmed!');
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
                    <Text>Price: {decodedSellerDetails[2]}</Text>
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
