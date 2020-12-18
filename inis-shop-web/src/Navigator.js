import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import { makeStyles } from '@material-ui/core/styles';

import GlobalState from './GlobalState';




import SignIn from './SignIn';
import Dashboard from './Dashboard';


const useStyles = makeStyles((theme) => ({

    appBar: {
        position: 'static',
        backgroundColor: "#333",
        color: "#fff",
        //alignItems: 'center'
    
      },

      signOutButton:{
        color: "#fff",
        marginRight : "20px",
        fontWeight: "500"
      },

      title: {
        flexGrow : 1
      }


}));

export default function Navigator() {

    const classes = useStyles();
    const [state, setState] = React.useContext(GlobalState);

    const handleSignOut = () =>
    {
      setState(state => ({...state, signedIn: false}));
    }

    return (
        <React.Fragment>
            <CssBaseline />

                {!state.signedIn && (
                    <SignIn/> 
                )}

                { state.signedIn && (
                   <Dashboard/>
                )}      
        
        </React.Fragment>
    );
}