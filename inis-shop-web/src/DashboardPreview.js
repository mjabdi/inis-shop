import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';




import { Tooltip } from '@material-ui/core';
import GlobalState from './GlobalState';


const useStyles = makeStyles((theme) => ({
 
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function DashboardPreview() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
        <React.Fragment>

<           Grid container spacing={3}>
                   
                    <Grid item xs={12} md={4} lg={6}>
                    <Paper className={fixedHeightPaper}>
                       
                    </Paper>
                    </Grid>
                 
                    <Grid item xs={12} md={4} lg={3}>
                     <Paper className={fixedHeightPaper}>
                       
                    </Paper>
                    </Grid>
                  
                    <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                      
                    </Paper>
                    </Grid>
                 
                    <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      
                    </Paper>
                    </Grid>
          </Grid>
        </React.Fragment>
  );
}