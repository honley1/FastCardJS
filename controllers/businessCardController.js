const {BusinessCard, User} = require('../models/model');
const {getBusinessCardObject} = require('../utils/objects');

const logger = require('../utils/logger');

class BusinessCardController {
    async getBusinessCardById(req, res) {
        try {
            const {id} = req.params;
            const businessCard = await BusinessCard.findByPk(id);

            if (!businessCard) {
                return res.status(404).json({ message: 'Business card not found' });
            }
            if (!businessCard.isActivated) {
                return res.status(403).json({ message: 'Business card not activated'});
            }

            return res.status(200).json(getBusinessCardObject(businessCard));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async activateBusinessCard(req, res) {
        try {
            const {username} = req.body;

            const user = await User.findOne({ where: { username: username } });
            const businessCardExistByUserId = await BusinessCard.findOne({ where: { userId: user.id } });

            const businessCard = await BusinessCard.findOne({where: {userId: user.id}});


            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            if (!businessCardExistByUserId) {
                return res.status(404).json({message: 'Business card does not exist'});
            }

            businessCard.isActivated = true;

            await businessCard.save();

            logger.info(`Business card with ID ${id} activated`);

            return res.status(200).json(getBusinessCardObject(businessCard));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    // async activateBusinessCard(req, res) {
    //     try {
    //         const {username, content} = req.body;
    //
    //         const {avatar} = req.files;
    //
    //         const user = await User.findOne({ where: { username: username } });
    //         const businessCardExistByUserId = await BusinessCard.findOne({ where: { userId: userId } });
    //
    //         const userId = user.id;
    //         const email = user.email;
    //
    //
    //         if (!avatar) {
    //             return res.status(400).json({ message: 'No avatar file uploaded' });
    //         }
    //         if (businessCardExistByUserId) {
    //             return res.status(409).json({ message: 'Business card already exists' });
    //         }
    //         if ()
    //
    //         // let fileName = uuid.v4() + ".png";
    //         // avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
    //
    //         const businessCard = await BusinessCard.create({
    //             userId, avatar: fileName, email,
    //             full_name, location, phone_number, detailed_information,
    //             instagram, telegram, whatsapp, viber, github, linkedIn, facebook
    //         });
    //
    //         logger.info(`New business card with ID ${businessCard.id} created`);
    //
    //         return res.status(200).json(getBusinessCardObject(businessCard));
    //     } catch (e) {
    //         logger.error(e);
    //         return res.status(400).json({
    //             status: "bad request",
    //             code: 400
    //         });
    //     }
    // }

    async updateBusinessCard(req, res) {
        try {
            const {content} = req.body;

            const user = req.user;

            const businessCard = await BusinessCard.findOne({where: {userId: user.id}});

            if (!businessCard) {
                return res.status(404).json({ message: 'Business card not found' });
            }

            if (businessCard.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'You do not have permission to update this business card' });
            }

            businessCard.content = content;

            await businessCard.save();

            logger.info(`Business card with ID ${id} updated`);

            return res.status(200).json(getBusinessCardObject(businessCard));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async deleteBusinessCard(req, res) {
        try {
            const {id} = req.params;
    
            const businessCard = await BusinessCard.findByPk(id);
    
            if (!businessCard) {
                return res.status(404).json({ message: 'Business card not found' });
            }
            
            if (businessCard.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'You do not have permission to delete this business card' });
            }
    
            await businessCard.destroy();
    
            logger.info(`Business card with ID ${id} deleted`);
    
            return res.status(204).send();
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }    
}

module.exports = new BusinessCardController();
