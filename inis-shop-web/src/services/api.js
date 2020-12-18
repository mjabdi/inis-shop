import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8080',

  headers : {
      'Authorization' : 'Basic QXp1cmXEaWFtb45kOmh1bnRlc7UK'
  }
});