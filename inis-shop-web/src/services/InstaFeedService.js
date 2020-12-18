import API from './api';
import axiosRetry from 'axios-retry';

export default class InstaFeedService {


   static getFeeds = (userId, pageSize, after) =>
   {
       if (!after)
       {
           return API.get(`/api/feed/getuserfeeds?id=${userId}&page_size=${pageSize}`);
       }
       else
       {
           return API.get(`/api/feed/getuserfeeds?id=${userId}&page_size=${pageSize}&after=${after}`);
       }     
   }

};