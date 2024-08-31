const {Application, BusinessCard} = require('../models/model');
const {getApplicationObject} = require('../utils/objects');
const {sendApplication} = require('../utils/telegramBot'); // Импортируем функцию

const logger = require('../utils/logger');

class ApplicationController {
    async createApplication(req, res) {
        try {
            const {full_name, phone_number, html, css} = req.body;

            const userId = req.user.id
            const username = req.user.username;

            const applicationExistByUserId = await Application.findOne({where: {userId: userId}});

            if (applicationExistByUserId) {
                return res.status(409).json({ message: 'Application has already been submitted' });
            }

            const application = await Application.create({
                userId, full_name, phone_number, html, css
            });
            const businessCard = await BusinessCard.create({
                html: html, css: css, isActivated: false
            })

            logger.info(`Application number ${application.id} was submitted`);

            await sendApplication(full_name, phone_number, username);

            return res.status(200).json(getApplicationObject(application));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async deleteApplication(req, res) {
        try {
            const {id} = req.params;
    
            const application = await Application.findByPk(id);
    
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }
            
            if (application.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'You do not have permission to delete this application' });
            }
    
            await application.destroy();
    
            logger.info(`Application with ID ${id} deleted`);
    
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

module.exports = new ApplicationController();
