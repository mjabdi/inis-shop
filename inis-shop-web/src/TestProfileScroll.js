import React, { useEffect, useState } from 'react';
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
import { AppBar, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { IconButton, Toolbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';
import Copyright from './CopyRight';
import InstaFeedService from './services/InstaFeedService';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import InfoIcon from '@material-ui/icons/Info';

import LinearProgress from '@material-ui/core/LinearProgress';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import ScrollTrigger from 'react-scroll-trigger';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';

import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const userId = '2009013096';

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
  
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  
    return (
      <Zoom in={trigger}>
        <div onClick={handleClick} role="presentation" className={classes.rootZoom}>
          {children}
        </div>
      </Zoom>
    );
  }
  
  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });
  
    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
  }
  
  ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };

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

    title:{
        fontWeight: '400',
        fontFamily: 'BioRhyme, serif'
    },  

 
    appBar: {
      position: 'sticky',
      // backgroundColor: "#333",
      // color: "#fff",
      alignItems: 'center'
  
    },

    rootZoom: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
      },

   
      media: {
        height: 400,
      },

      card_root: {
        width: 345,
      },
}));

export default function TestProfileScroll() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const [feeds, setFeeds] = React.useState([]);
  const [endCursor, setEndCursor] = React.useState(null);

  const [loading, setLoading] = useState(false);

  const [loadMore, setLoadMore] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  useEffect( () => 
  {
     const loadFeeds = async () =>
     {
         try
         {
            setLoading(true);
            const res = await InstaFeedService.getFeeds(userId,12,endCursor); 
            
            if (res.data.status === 'OK')
            {
               setFeeds(res.data.posts);
               setEndCursor(res.data.end_cursor);
            }    

            setLoading(false);

         }catch(err)
         {
             setLoading(false);
             console.error(err);
         }
          
     } 
    
     loadFeeds();

     const interval = setInterval(() => {
        setLoadMore(false);
     }, 2000);

     return () => {
         clearInterval(interval);
     }
       
  


  }, []);

  useEffect( () => 
  {
     const loadFeeds = async () =>
     {
         try
         {        
            // console.log('loadFeeds...');
            setLoadingMore(true);
            const res = await InstaFeedService.getFeeds(userId,12,endCursor); 
            if (res.data.status === 'OK')
            {
               setFeeds([...feeds, ...res.data.posts]);
               setEndCursor(res.data.end_cursor);
            }    
            setLoadingMore(false);

         }catch(err)
         {
             setLoadingMore(false);
             console.error(err);
         }          
     } 

    //  console.log(endCursor);

     if (endCursor)
     {
        loadFeeds();
     }
    
   

  }, [loadMore]);



  const onProgressViewPort = ({progress}) =>
  {
    //   console.log(progress);
    //   console.log(loadMore);
     if (progress > 0.7)
     {
        setLoadMore(true);
     }
  }


  return (
    <React.Fragment>
        <div id="back-to-top-anchor"></div>

        <ElevationScroll>
            <AppBar color="secondary" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h5" color="inherit" noWrap className={classes.title}>
                            Inisa Shop
                        </Typography>
                    </Toolbar>
            </AppBar>
         </ElevationScroll>



    {loading && (
        <div style={{width:"100%", paddingTop:"3px"}}>
                <LinearProgress color="secondary" />
        </div>
         

    )}

      {!loading && (

    <div style={{padding:"50px"}}>

<ScrollTrigger onProgress={onProgressViewPort}>

    <Grid container direction="row" alignContent="center" alignItems="center" justify="space-around" spacing={3}>

        {feeds.map((post) => (
            <Grid item md={4}> 
                    <Card className={classes.card_root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={post.images[0].display_url}
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                         {/* {post.caption} */}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                            Buy
                            </Button>
                            <Button size="small" color="primary">
                            See More
                            </Button>
                        </CardActions>
                        </Card>
            
            </Grid>

       

        ))}


                  </Grid>

                  </ScrollTrigger>
             </div>
      )}   
         

       {loadingMore && (
            
            <div style={{position:"fixed", right: "50px", bottom: "50px"}}>
                <CircularProgress color="secondary" />
            </div>
       )}
     

     <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>


            <Box mt={8}>
              <Copyright />
            </Box>
        

    </React.Fragment>

    
  );
}