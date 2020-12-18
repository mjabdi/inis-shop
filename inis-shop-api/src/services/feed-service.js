const express = require('express');
const router = express.Router();

const axios = require('axios');
const {fixNumbers} = require('./../utils/persian-numbers');

/// Get User Feeds
router.get('/getuserfeeds', async (req, res, next) => {

   const id = req.query.id;
   const page_size = req.query.page_size;
   const after = req.query.after;

   let result = [];

 
    const allRows =  await axios.get(getFetchUrl(id, page_size || 12 ,after));
    const allRowsData = JSON.parse(JSON.stringify(allRows.data.data));
    const edges = allRowsData.user.edge_owner_to_timeline_media.edges;
    const totalCount =  allRowsData.user.edge_owner_to_timeline_media.count;
    const end_cursor =  allRowsData.user.edge_owner_to_timeline_media.page_info.end_cursor;
    const has_next_page = allRowsData.user.edge_owner_to_timeline_media.page_info.has_next_page;

    edges.forEach(item => {

        const node = item.node;
        if (node.__typename === 'GraphImage')
        {
            let post = {};
            post.id = node.id;
            post.images = [ 
                {
                    dimensions : node.dimensions,
                    display_url : node.display_url
                }
            ]
            post.caption = node.edge_media_to_caption.edges[0] ?  node.edge_media_to_caption.edges[0].node.text : '';
            post.likes = node.edge_media_preview_like.count;
            post.price = getPriceFromCaption(post.caption);

            result.push(post); 
        }
        else if (node.__typename === 'GraphSidecar')
        {
            let post = {};
            post.id = node.id;
            post.caption = node.edge_media_to_caption.edges[0] ?  node.edge_media_to_caption.edges[0].node.text : '';
            post.likes = node.edge_media_preview_like.count;
            post.price = getPriceFromCaption(post.caption);
            
            post.images = [];

            node.edge_sidecar_to_children.edges.forEach(child => {
                let photo = {};
                photo.dimensions = child.node.dimensions;
                photo.display_url = child.node.display_url;
                post.images.push(photo);
            });

            result.push(post); 
        }

        
    });


    res.send({ status: 'OK' , total_count: totalCount , end_cursor: end_cursor, has_next_page: has_next_page ,page_count: result.length , posts: result });
    return;

});

const getPriceFromCaption = (caption) =>
{
    const end = caption.indexOf('تومان');
    let start = end - 10;
    if (start < 0)
        start = 0;


    const price = caption.substring(start, end);

    console.log(price);

    return parseInt(fixNumbers(price.trim())) || 0;
}




const getFetchUrl = (id, first, after) =>
{
    if (!after)
        return  `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":"${id}","first":${first}}`;
    else
       return  `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":"${id}","first":${first},"after":"${after}"}`;      
}


module.exports = router;
