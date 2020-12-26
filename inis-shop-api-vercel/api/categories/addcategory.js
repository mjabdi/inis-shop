import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import Category from '../../models/Category'
import allowCors from '../../utils/allow-cors'

const handler = (req, res) => {

    if (checkToken(req,res))
    {
        const { method } = req
        
        switch (method) {

            case 'POST':
                try
                {
                    if (!req.body.title)
                    {
                        res.status(400).send({status: 'FAILED' , error: 'title is missing'});
                        return;
                    }

                    const parentId = req.body.parentId ? mongoose.Types.ObjectId(req.body.parentId) : null
                    
                    await dbConnect()

                    const found = await Category.findOne({title: req.body.title, parentId: parentId}).exec()
                    if (found)
                    {
                        res.status(400).send({status: 'FAILED' , error: `${req.body.title} is already exists`})
                        return
                    }

                    const category = new Category({
                        timeStamp : new Date(),
                        title: req.body.title,
                        description : req.body.description || '',
                        parentId: parentId
                    });
                    const result = await category.save()
                    res.status(201).send({status: 'OK' , result: result})

                }
                catch(err)
                {
                    res.status(500).json({status:'FAILED', error : err.message})
                }
                break
            default:
                res.status(404).send('invalid endpoint')
                break
        }
    }
}

module.exports = allowCors(handler)