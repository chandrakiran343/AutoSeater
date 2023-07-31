import {createBrowserRouter} from 'react-router-dom';
import App from '../App.tsx';
import GeneralTab from '../comps/GeneralTab.tsx';


const router = createBrowserRouter([
        {
            path: '/',
            element: <App />
        },
        {
            path: '/home',
            element: <GeneralTab />
        }
    ]
);

export default router;