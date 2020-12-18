const { Shop } = require("./models/Shop");
const logger = require('./utils/logger')();
const axios = require('axios');
const { Post } = require("./models/Post");
const { PostImage } = require("./models/PostImage");


const InstagramFeedServiceModule = {};


let FindNewShopsTimer = null;
let BrowseShopTimer = null;

const ShopsToBrowse = [];

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

    logger.info('InstagramFeedService Stopped.');
}

InstagramFeedServiceModule.start = () =>
{
    logger.info('InstagramFeedService Started.');

    FindNewShopsTimer = setInterval(() => {
        findNewShopsToBrowse();
    }, 5000);

    
    
    BrowseShopTimer = setInterval(  () => {

        ScheduleBrowseShops();

    }, 10000);
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
    const shop = await Shop.findOne({isUpdating: false, lastUpdateTimeStamp : {$eq : null} });
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
     const allRowsData = JSON.parse(JSON.stringify(allRows.data.data));
     const edges = allRowsData.user.edge_owner_to_timeline_media.edges;
     const end_cursor =  allRowsData.user.edge_owner_to_timeline_media.page_info.end_cursor;
     const has_next_page = allRowsData.user.edge_owner_to_timeline_media.page_info.has_next_page;
 
     edges.forEach(async item => {
         const node = item.node;
         if (node.__typename === 'GraphImage')
         {
             let post = {};
             post.id = node.id;
             post.images = [ 
                 {
                     dimensions : node.dimensions,
                     display_url : node.display_url,
                     small_image_url : node.display_resources[0].src
                 }
             ]
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
                     imageUrl: post.images[0].display_url,
                     imageUrlSmall : post.images[0].small_image_url,
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
           
             
             post.images = [];
 
             node.edge_sidecar_to_children.edges.forEach(child => {
                 let photo = {};
                 photo.dimensions = child.node.dimensions;
                 photo.display_url = child.node.display_url;
                 photo.small_image_url = child.node.display_resources[0].src;
                 post.images.push(photo);
             });
 
             const postDoc = new Post(
                {
                    timeStamp : new Date(),
                    shopId: shopId,
                    id: post.id,
                    type: node.__typename,
                    caption: post.caption,
                    imageUrl: post.images[0].display_url,
                    imageUrlSmall: post.images[0].small_image_url,
                    likes: post.likes,
                    postTimeStamp: post.timeStamp,
                }
            );

            if (!await Post.findOne({id: post.id, shopId: shopId}))
            {
               await postDoc.save();
               post.images.forEach( async (image, index) => {
                const postImage = new PostImage(
                    {
                        timeStamp: new Date(),
                        shopId: shopId,
                        id: post.id,
                        imageUrl: image.display_url,
                        imageUrlSmall: image.small_image_url,
                        isMainImage: (index === 0)
                    }
                );
                await postImage.save();
              });
            }
         }
     });

     await Shop.updateOne({id : shopId}, {end_cursor : end_cursor});

     return end_cursor;
}

const getFetchUrl = (id, first, after) =>
{
    if (!after)
        return  `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":"${id}","first":${first}}`;
    else
       return  `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":"${id}","first":${first},"after":"${after}"}`;      
}


module.exports = InstagramFeedServiceModule;