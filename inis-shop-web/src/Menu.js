import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';


import { ListItemIcon, Tooltip } from '@material-ui/core';
import GlobalState from './GlobalState';
import { List, ListItem } from '@material-ui/core';

import ListItemText from '@material-ui/core/ListItemText';
import {MenuList} from './MenuList';


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

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    setSelectedIndex(state.currentMenuIndex);
  }, [state.currentMenuIndex]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setState(state => ({...state, currentMenuIndex: index}))
  };

  return (
        <React.Fragment>

            <List>

                  {MenuList.map((item) => ( (!item.hidden) && (
                        <ListItem button selected={selectedIndex === item.index} onClick={(event) => handleListItemClick(event, item.index)}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={`${item.title}`} />
                        </ListItem>
                     )
                  ))}

            </List>

        </React.Fragment>
  );
}