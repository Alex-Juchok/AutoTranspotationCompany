import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token){
        try{
            const decode = jwt.verify(token, 'secret_key');
            
            req.userId = decode._id;
            next();
        } catch (err){
            return res.status(403).json({
                success: 'false',
                message: 'Нет доступа, срок действия токена истек',
            });
        }
    }else{
        return res.status(403).json({
            success: false,
            message: 'Нет доступа',
        });
    }

};