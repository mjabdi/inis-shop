import API from './api';
export default class InstaFeedService {

   static getFeeds = (shopId, pageSize, after) =>
   {
       if (!after)
       {
           return API.get(`/api/posts/getshopposts?shop_id=${shopId}&page_size=${pageSize}`);
       }
       else
       {
           return API.get(`/api/posts/getshopposts?shop_id=${shopId}&page_size=${pageSize}&after=${after}`);
       }     
   }

};