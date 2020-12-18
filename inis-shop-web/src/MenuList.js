


import DashboardPreview from './DashboardPreview';


import DashboardIcon from '@material-ui/icons/Dashboard';



export const MenuList = [
    {index: 0, id:`dashboard`, title: `Dashboard`, icon : <DashboardIcon/>, content: <DashboardPreview />},
  
  ];

  export const getMenuContent = (index) =>
  {
      for (var i=0; i < MenuList.length; i++)
      {
          if (MenuList[i].index === index)
          {
              return MenuList[i].content;
          }
      }

      return (`Page Not Found!`); 
  }


  export const getMenuIndex = (id) =>
  {
      for (var i=0; i < MenuList.length; i++)
      {
          if (MenuList[i].id === id)
          {
              return MenuList[i].index;
          }
      }

      return -1;
  }




