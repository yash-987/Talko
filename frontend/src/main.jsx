
import { createRoot } from 'react-dom/client';
import App from './App';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';


const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}
const theme = extendTheme({config})
createRoot(document.getElementById('root')).render(
	
		<BrowserRouter>
			<RecoilRoot>


			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
			</RecoilRoot>
		</BrowserRouter>
	
);
