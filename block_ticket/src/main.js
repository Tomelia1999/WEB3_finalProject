import { Box, Input, Text, VStack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

const ThreeInputsPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const sendEmail = async () => {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;

    try {
      const response = await axios.post('http://localhost:3000/send-email', {
        recipient: input2,
        subject: 'New Email from BLOCK-TICKET',
        text: `What do you want to sell? ${input1}\nWho do you want to sell for? ${input2}\nPrice you want to sell: ${input3}`
      });
      
      if (response.status == 200) {
        setEmailSent(true);
        setEmailError(false);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError(true);
      setEmailSent(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <VStack spacing={4}>
        <Box>
          <Text fontSize="xl">What do you want to sell?</Text>
          <Input id="input1" placeholder="Enter Ticket Address" />
        </Box>
        <Box>
          <Text fontSize="xl">Who do you want to sell for?</Text>
          <Input id="input2" placeholder="Enter an Email" />
        </Box>
        <Box>
          <Text fontSize="xl">Price you want to sell</Text>
          <Input id="input3" placeholder="Enter the price" />
        </Box>
        <Button onClick={sendEmail}>Send</Button>
        {emailSent && <Text>Email sent successfully!</Text>}
        {emailError && <Text color="red.500">Error sending email. Please try again.</Text>}
      </VStack>
    </Box>
  );
};

export default ThreeInputsPage;
