import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import GlobalState from './GlobalState';
import Alert from '@material-ui/lab/Alert';
import { AppBar, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { IconButton, Toolbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';
import Copyright from './CopyRight';


const useStyles = makeStyles((theme) => ({

    root: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },

        display: 'flex',
        flexWrap: 'wrap',
      },  

      margin: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
      },

      paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
    },

    RememberMe:{
      textAlign: "left"
    },

    appBar: {
      position: 'static',
      // backgroundColor: "#333",
      // color: "#fff",
      alignItems: 'center'
  
    },
}));

export default function SignIn() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const [password, setPassword] = React.useState(
    localStorage.getItem('pcr-admin-password') || ''
  );

  const [username, setUsername] = React.useState(
    localStorage.getItem('pcr-admin-username') || ''
  );

  const [saveChecked, setSaveChecked] = React.useState(
    localStorage.getItem('pcr-admin-username') ? true : false
  ); 


  const signIn = () => {
    if (username && password && ((username.toLowerCase() === 'admin' && password === 'MELLIM2020!gbc')
                             || ((username.toLowerCase() === 'rptadmin' && password === 'MELLIM2020!gbc'))))
    {
        if (username.toLowerCase() === 'rptadmin')
        {
          setState(state => ({...state, showCreateExcel : true}));
        }
        else
        {
          setState(state => ({...state, showCreateExcel : false}));
        }

        setState(state => ({...state, signedIn : true }));
        if (saveChecked)
        {
           localStorage.setItem('pcr-admin-username', username);
           localStorage.setItem('pcr-admin-password', password);
        }else{
          localStorage.removeItem('pcr-admin-username');
          localStorage.removeItem('pcr-admin-password');
        }

    }else
    {
        setState(state => ({...state, signedInError : true }));
    }
  }

  const usernameChanged = (event) =>
  {
      setUsername(event.target.value);
      setState(state => ({...state, signedInError : false }));
  }

  const passwordChanged = (event) =>
  {
      setPassword(event.target.value);
      setState(state => ({...state, signedInError : false }));
  }

  const handleClickShowPassword = () => {
    setState(state => ({...state, showPassword : !state.showPassword }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const saveCheckedChanged = (event) =>
  {
    setSaveChecked(event.target.checked);
  }

  return (
    <React.Fragment>
        <AppBar position="absolute" color="primary" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap className={classes.title}>
                         InisaShop Console
                    </Typography>
                </Toolbar>
            </AppBar>
          <Container component="main" maxWidth="xs">



            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  value={username}
                  onChange={usernameChanged}
                  margin="normal"
                  required
                  fullWidth
                  id="usrname"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />

              <FormControl 
                              fullWidth 
                              required 
                              className={clsx(classes.margin, classes.textField)} 
                              variant="outlined"
                              onKeyPress= {event => {
                                if (event.key === 'Enter') {
                                  signIn();
                                }
                              }}
                              
                              >
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="outlined-adornment-password"
                    type={state.showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={passwordChanged}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {state.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={100}
                  />
                </FormControl>
              
              <div align="left">
                  <FormControlLabel className={classes.RememberMe}
                      control={<Checkbox value="remember" color="primary" checked={saveChecked} onChange={saveCheckedChanged}  />}
                      label="Save password on this device"
                    />
              </div>




                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick = {signIn}
                  onTouchTap = {signIn}
                  className={classes.submit}
                >
                  Sign In
                </Button>


              </form>
            </div>

            {state.signedInError && (
                <div className={classes.root}>
                    <Alert fullWidth severity="error">Invalid Username or Password. Please try again.</Alert>
                </div> 
            )}

            <Box mt={8}>
              <Copyright />
            </Box>
          </Container>

    </React.Fragment>

    
  );
}