export default function checkToken(req, res) {

    const token = process.env.AuthToken; 
    if (req.headers.authorization !== `Basic ${token}`) {
        res.status(401).send('Access Denied!');
        return false;
      }


      return true;
}