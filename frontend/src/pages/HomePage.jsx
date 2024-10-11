import {
	Box,
	Container,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from '@chakra-ui/react';
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';
function HomePage() {
	return (
		<Container maxW={'xl'} centerContent>
			<Box
				display={'flex'}
				justifyContent="center"
				p="3"
			bg={'white'}
				w="100%"
				m="40px 0 15px 0"
				borderRadius={'lg'}
				borderWidth="1px"
			>
				<Text fontSize="3xl" fontFamily={'Work sans'} color={'black'}>
					Chat-Wise
				</Text>
			</Box>

			<Box
				bg={'white'}
				w={'100%'}
				borderRadius={'lg'}
				p={'4'}
				
				borderWidth={'1px'}
			>
				<Tabs variant="soft-rounded">
					<TabList mb={'1em'}>
						<Tab width="50%">Login</Tab>
						<Tab width="50%">Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
              {/* Login component */}
              {<Login/>}
						</TabPanel>
						<TabPanel>
              {/* Sign up component */}
              <Signup/>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
}

export default HomePage;
