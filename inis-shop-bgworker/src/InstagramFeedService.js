const { Shop } = require("./models/Shop");
const logger = require('./utils/logger')();
const axios = require('axios');
const { Post } = require("./models/Post");
const { PostImage } = require("./models/PostImage");

const fs = require('fs')
const path = require('path');
const { cat } = require("shelljs");

const imageDownloader = require('image-downloader')


const InstagramFeedServiceModule = {};

const IMAGE_DIR = 'd:/insta_images/'

let FindNewShopsTimer = null;
let BrowseShopTimer = null;

let FindUpdateShopsTimer = null;
let UpdateShopTimer = null;

const ShopsToBrowse = [];

const ShopsToUpdate = [];

let shopUpdatePointer = 0;

let shopPointer = 0;

InstagramFeedServiceModule.stop = () =>
{
   
    if (BrowseShopTimer)
    {
        clearInterval(BrowseShopTimer);
    }

    if (FindNewShopsTimer)
    {
        clearInterval(FindNewShopsTimer);
    }
    
    if (FindUpdateShopsTimer)
    {
        clearInterval(FindUpdateShopsTimer);
    }
    
    if (UpdateShopTimer)
    {
        clearInterval(UpdateShopTimer);
    }

    logger.info('InstagramFeedService Stopped.');
}

InstagramFeedServiceModule.start = () =>
{
    logger.info('InstagramFeedService Started.');

    FindNewShopsTimer = setInterval(() => {
        findNewShopsToBrowse();
    }, 5000);

  
    BrowseShopTimer = setInterval( () => {
        ScheduleBrowseShops();
    }, 10000);


    FindUpdateShopsTimer = setInterval(() => {
        findShopsToUpdate();
    }, 8000);

    UpdateShopTimer = setInterval( () => {
        ScheduleUpdateShops();
    }, 20000);
}

async function findShopsToUpdate()
{
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 Hour Ago
    const shop = await Shop.findOne({isUpdating: false, lastUpdateTimeStamp : {$lt : oneHourAgo}, disabled : {$ne : true} });
    if (shop)
    {
        await Shop.updateOne({_id: shop._id }, {isUpdating: true});
       
        ShopsToUpdate.push({id: shop.id, end_cursor: null});
    }

}

async function ScheduleUpdateShops()
{
    if (ShopsToUpdate && ShopsToUpdate.length > 0)
    {
        if (shopUpdatePointer >= ShopsToUpdate.length)
        {
            shopUpdatePointer = 0;
        }

        const {id, end_cursor} = ShopsToUpdate[shopUpdatePointer];
        shopUpdatePointer++;

        const new_cursor = await UpdateShop(id, end_cursor);
        if (new_cursor)
        {
            ShopsToUpdate[shopUpdatePointer-1] = {id: id, end_cursor: new_cursor};
        }else
        {
            ShopsToUpdate.splice(shopUpdatePointer-1, 1);
            await Shop.updateOne({id: id}, {lastUpdateTimeStamp: new Date(), isUpdating: false});
        }   
    }
}

async function UpdateShop(shopId, after)
{
    const page_size = 40;

    const lastPost = await Post.findOne().sort({postTimeStamp:-1}).exec();   
    
    logger.info(getFetchUrl(shopId, page_size, after));
    const allRows =  await axios.get(getFetchUrl(shopId, page_size, after));
    const allRowsData = JSON.parse(JSON.stringify(allRows.data.data));
    const edges = allRowsData.user.edge_owner_to_timeline_media.edges;
    const end_cursor =  allRowsData.user.edge_owner_to_timeline_media.page_info.end_cursor;
    const has_next_page = allRowsData.user.edge_owner_to_timeline_media.page_info.has_next_page;

    let found = false;

   

   for (var i=0 ;i < edges.length; i++)
   {
       const item = edges[i];

        const node = item.node;
        if (node.__typename === 'GraphImage')
        {
            let post = {};
            post.id = node.id;
            post.imageUrl =  node.display_resources[0].src;
            post.caption = node.edge_media_to_caption.edges[0] ?  node.edge_media_to_caption.edges[0].node.text : '';
            post.likes = node.edge_media_preview_like.count;
            post.timeStamp = new Date(node.taken_at_timestamp * 1000);

            const postDoc = new Post(
                {
                    timeStamp : new Date(),
                    shopId: shopId,
                    id: post.id,
                    type: node.__typename,
                    caption: post.caption,
                    imageUrl: post.imageUrl,
                    likes: post.likes,
                    postTimeStamp : post.timeStamp,
                }
            );
               
            const postFound = await Post.findOne({id: post.id, shopId: shopId});
             
            if (!postFound)
            {
               await postDoc.save();
            }
            else
            {
               found = true;
            }
        }
        else if (node.__typename === 'GraphSidecar')
        {
            let post = {};
            post.id = node.id;
            post.imageUrl =  node.display_resources[0].src;
            post.caption = node.edge_media_to_caption.edges[0] ?  node.edge_media_to_caption.edges[0].node.text : '';
            post.likes = node.edge_media_preview_like.count;
            post.timeStamp = new Date(node.taken_at_timestamp * 1000);
          
            
            post.children = [];

            for (var i=0 ; i <  node.edge_sidecar_to_children.edges.length; i++)
             {
                 const child =  node.edge_sidecar_to_children.edges[i]
                 post.children.push({id: child.node.id, type: child.node.__typename, imageUrl: child.node.display_resources[0].src});
             }

            const postDoc = new Post(
               {
                   timeStamp : new Date(),
                   shopId: shopId,
                   id: post.id,
                   type: node.__typename,
                   caption: post.caption,
                   imageUrl: post.imageUrl,
                   likes: post.likes,
                   postTimeStamp: post.timeStamp,
               }
           );

          const postFound = await Post.findOne({id: post.id, shopId: shopId});
           if (!postFound)
           {
               await postDoc.save();
               post.children.forEach( async (child, index) => {
                const postImage = new PostImage(
                    {
                        timeStamp: new Date(),
                        shopId: shopId,
                        id: post.id,
                        type: child.type,
                        imageUrl: child.imageUrl,
                        isMainImage: (index === 0)
                    }
                );
                await postImage.save();
             });
           }
           else
           {
              found = true;
           }
        }
    }

   
    return found ? null : end_cursor;
}

async function ScheduleBrowseShops ()
{
    if (ShopsToBrowse && ShopsToBrowse.length > 0)
    {
        if (shopPointer >= ShopsToBrowse.length)
        {
            shopPointer = 0;
        }

        const {id,end_cursor} = ShopsToBrowse[shopPointer];
        shopPointer++;

        const new_cursor = await BrowseShop(id, end_cursor);
        if (new_cursor)
        {
            ShopsToBrowse[shopPointer-1] = {id: id, end_cursor: new_cursor};
        }else
        {
            ShopsToBrowse.splice(shopPointer-1, 1);
            await Shop.updateOne({id: id}, {lastUpdateTimeStamp: new Date(), isUpdating: false});
        }   
    }
}

async function findNewShopsToBrowse(){   
    const shop = await Shop.findOne({isUpdating: false, lastUpdateTimeStamp : {$eq : null}, disabled : {$ne : true} });
    if (shop)
    {
        await Shop.updateOne({_id: shop._id }, {isUpdating: true});
       
        ShopsToBrowse.push({id: shop.id, end_cursor: shop.end_cursor || null});
    }
}

async function BrowseShop(shopId, after)
{
     const page_size = 40;
    
     console.log(getFetchUrl(shopId, page_size, after));
     const allRows =  await axios.get(getFetchUrl(shopId, page_size, after));
     console.log(allRows.data.data)
     const allRowsData = JSON.parse(JSON.stringify(allRows.data.data));
     const edges = allRowsData.user.edge_owner_to_timeline_media.edges;
     const end_cursor =  allRowsData.user.edge_owner_to_timeline_media.page_info.end_cursor;
     const has_next_page = allRowsData.user.edge_owner_to_timeline_media.page_info.has_next_page;

   
 
     for (var eindex = 0; eindex < edges.length; eindex++) {
        //  await sleep(1000)
         const item = edges[eindex]
         const node = item.node;
         if (node.__typename === 'GraphImage')
         {
             let post = {};
             post.id = node.id;
             post.caption = node.edge_media_to_caption.edges[0] ?  node.edge_media_to_caption.edges[0].node.text : '';
             post.likes = node.edge_media_preview_like.count;
             post.timeStamp = new Date(node.taken_at_timestamp * 1000);
             post.imageUrl = node.display_resources[0].src

             const postDoc = new Post(
                 {
                     timeStamp : new Date(),
                     shopId: shopId,
                     id: post.id,
                     type: node.__typename,
                     caption: post.caption,
                     imageUrl: post.imageUrl,
                     likes: post.likes,
                     postTimeStamp : post.timeStamp,
                 }
             );
                 
             if (!await Post.findOne({id: post.id, shopId: shopId}))
             {
                await postDoc.save();
             }
         }
         else if (node.__typename === 'GraphSidecar')
         {
             let post = {};
             post.id = node.id;
             post.caption = node.edge_media_to_caption.edges[0] ?  node.edge_media_to_caption.edges[0].node.text : '';
             post.likes = node.edge_media_preview_like.count;
             post.timeStamp = new Date(node.taken_at_timestamp * 1000);
             post.imageUrl = node.display_resources[0].src
             
             post.children = [];

             for (var i=0 ; i <  node.edge_sidecar_to_children.edges.length; i++)
             {
                 const child =  node.edge_sidecar_to_children.edges[i]
                 post.children.push({id: child.node.id, type: child.node.__typename, imageUrl: child.node.display_resources[0].src});
             }
 
             const postDoc = new Post(
                {
                    timeStamp : new Date(),
                    shopId: shopId,
                    id: post.id,
                    type: node.__typename,
                    caption: post.caption,
                    imageUrl: post.imageUrl,
                    likes: post.likes,
                    postTimeStamp: post.timeStamp,
                }
            );

            if (!await Post.findOne({id: post.id, shopId: shopId}))
            {
               await postDoc.save();
               post.children.forEach( async (child, index) => {
                const postImage = new PostImage(
                    {
                        timeStamp: new Date(),
                        shopId: shopId,
                        parentId: post.id,
                        id: child.id,
                        type: child.type,
                        imageUrl: child.imageUrl,
                        isMainImage: (index === 0)
                    }
                );
                await postImage.save();
              });
            }
         }
     };

     await Shop.updateOne({id : shopId}, {end_cursor : end_cursor});

     return end_cursor;
}

const download_image = async (url, image_path) =>{
    url = url.replace('https', 'http')
    await sleep(100)
    ensureDirectoryExistence(image_path)
    await imageDownloader.image({
        url: url,
        dest: image_path,
        extractFilename: false
    }
    
    )
    // axios({
    //     url,
    //     responseType: 'stream',
    //   }, {
    //     timeout: 1000 * 50, // Wait for 5 seconds
    //   }).then(  
    //     response =>
    //       new Promise((resolve, reject) => {
    //         response.data
    //           .pipe(fs.createWriteStream(image_path))
    //           .on('finish', () => resolve())
    //           .on('error', e => reject(e));
    //       }),
    //   ).catch(err => console.log(err));
}    

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
  

  function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

const getFetchUrl = (id, first, after) =>
{
    if (!after)
        return  `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":"${id}","first":${first}}`;
    else
       return  `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":"${id}","first":${first},"after":"${after}"}`;      
}


module.exports = InstagramFeedServiceModule;