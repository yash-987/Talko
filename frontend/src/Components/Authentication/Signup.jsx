import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { UserAtom } from '../../store/user';
function Signup() {
	const setUser = useSetRecoilState(UserAtom)
	const navigate = useNavigate();
	const toast = useToast();
	const [inputs, setInputs] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		pic:''
	})
	const [show, setShow] = useState(false);

	const [isloading, setIsLoading] = useState(false);

	const handleShow = () => setShow(!show);

	const postDetails = (pics) => {
		console.log(pics);
		setIsLoading(true);

		console.log('function working');
		if (pics == undefined) {
			console.log('pic undefined');

			return toast({
				title: 'Please Select an Image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}

		if (pics.type === 'image./jpeg' || pics.type === 'image/png') {
			const data = new FormData();
			console.log('pic chosen');
			data.append('file', pics);
			data.append('upload_preset', 'ChatWise');
			data.append('cloud_name', 'dstwmymec');
			fetch('https://api.cloudinary.com/v1_1/dstwmymec/image/upload ', {
				method: 'post',
				body: data,
			})
				.then(async function (res) {
					const data = await res.json();
					console.log('data fetched');
					setInputs({...inputs,pic:data.url.toString()});
					console.log(data.url.toString())
					setIsLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setIsLoading(false);
				});
			
		} else {
			toast({
				title: 'Please Select an Image!',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'bottom',
			});
			setIsLoading(false);
			return;
		}
	};

	// const handlePic = ()=>{
	//   setTimeout(() => {
	// postDetails()
	//   }, 5000);
	// }
	const handleSubmit = async () => {
		setIsLoading(true);
		if (!inputs.name || !inputs.email || !inputs.password || !inputs.confirmPassword) {
			toast({
				title: 'Please Fill in all the fields!',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'bottom',
			});
			
			setIsLoading(false);
			return;
		}
		if (inputs.password !== inputs.confirmPassword) {
			toast({
				title: 'Passwords do not match!',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'bottom',
			});
			setIsLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					'Content-type ': 'application/json',
				},
			};
			const { data } = await axios.post(
				'/api/user',
				{
					name: inputs.name,
					email: inputs.email,
					password: inputs.password,
					pic:inputs.pic,
				},
				config
			);
			console.log('inputs',inputs);
			

			toast({
				title: 'Registration Successful!',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'bottom',
			});


			console.log(`User from Sign up component `, data);

			localStorage.setItem('user-info', JSON.stringify(data));
			setUser(data)
			console.log(`User after updating the state in store`,data)
			
			navigate('/chats');
			setIsLoading(false);
		} catch (error) {
			toast({
				title: error.message,
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'bottom',
			});
			setIsLoading(false);
		}
	};
	return (
		<VStack spacing="5px" color={'black'}>
			<FormControl id="first-name" isRequired color={'black'}>
				<FormLabel>Name</FormLabel>
				<Input
					type="text"
					value={inputs.name}
					bg={''}
					placeholder="Enter your name"
					onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
				/>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					value={inputs.email}
					placeholder="Enter your Email"
					onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				/>
			</FormControl>
			<FormControl id="password " isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size={'md'}>
					<Input
						type={show ? 'text' : 'password'}
						value={inputs.password}
						placeholder={'Enter Your password'}
						onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					/>
					<InputRightElement width={'4.5rem'}>
						<Button h={'1.75rem'} size={'sm'} onClick={handleShow}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="password " isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size={'md'}>
					<Input
						type={show ? 'text' : 'password'}
						value={inputs.confirmPassword}
						placeholder={'Confirm password'}
						onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
					/>
					<InputRightElement width={'4.5rem'}>
						<Button h={'1.75rem'} size={'sm'} onClick={handleShow}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<FormControl>
				<FormLabel>Upload Your Picture</FormLabel>
				<Input
					
					type="file"
					p={1.5}

					accept="image/*"
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>

			<Button
				colorScheme="blue"
				w={'100%'}
				mt={15}
				onClick={handleSubmit}
				isLoading={isloading}
			>
				Sign Up
			</Button>
		</VStack>
	);
}

export default Signup;
