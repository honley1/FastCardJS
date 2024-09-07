const {User, BusinessCard} = require('../models/model');
const {getUserObject} = require('../utils/objects');

const uuid = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const validateEmail = require('../utils/emailValidation');
const mailService = require('../utils/mailSender');

const generateJwt = (id, email, username, isActivated, role) => {
    return jwt.sign(
        {id, email, username, isActivated, role},
        process.env.SECRET_KEY,
        {expiresIn: '48h'}
    )
}

class UserController {
    async registration(req, res) {
        try {
            const { username, email, password } = req.body;

            const usernameAlreadyExist = await User.findOne({ where: { username } });
            const emailAlreadyExist = await User.findOne({ where: { email } });

            const MIN_PASSWORD_LENGTH = 8;

            if (password.length < MIN_PASSWORD_LENGTH) {
                return res.status(400).json({ message: 'Password is too short' });
            }
            if (usernameAlreadyExist) {
                return res.status(409).json({ message: 'Username already taken' });
            }
            if (emailAlreadyExist) {
                return res.status(409).json({ message: 'Email already taken' });
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Incorrect email format' });
            }
                
            const hashPassword = await bcrypt.hash(password, 5);
            const activationLink = uuid.v4();

            const user = await User.create({username: username, email: email, password: hashPassword, activationLink: activationLink, isActivated: false});
            let businessCard = await BusinessCard.findOne({where: {userId: user.id}});

            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/v1/user/activate/${activationLink}`);

            logger.info(`New user created: ${email}`);

            return res.status(200).json(getUserObject(user, businessCard));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(404).json({message: 'User not found'})
            }
            let comparePassword = await bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return res.status(401).json({message: 'Incorrect password specified'})
            }
            const token = generateJwt(user.id, user.email, user.username, user.isActivated, user.role);
            return res.status(200).json({message: user.role, token});
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async activate(req, res) {
        try{
            const activationLink = req.params.link;
            const user = await User.findOne({ where: { activationLink } });

            if (!user) {
                return res.status(400).json({message: 'Incorrect activation link'})
            }
            if (user.isActivated) {
                return res.status(400).json({message: 'Account has already been activated'});
            }
        
            user.isActivated = true;
            await user.save();

            const businessCard = await BusinessCard.findOne({where: {userId: user.id}});

            return res.status(200).json(getUserObject(user, businessCard));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async auth(req, res) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.username, req.user.isActivated, req.user.role);
            return res.status(200).json({message: 'GOOD', token: token});
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async checkAuth(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }

            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'BAD' });
                }

                return res.status(200).json({ message: 'GOOD' });
            });
        } catch (e) {
            logger.error(e);
            return res.status(500).json({
                status: "internal server error",
                code: 500
            });
        }
    }

    async getUserById(req, res) {
        try {
            const {id} = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({message: 'User not found'})
            }

            const businessCard = await BusinessCard.findOne({where: {userId: user.id}});

            return res.status(200).json(getUserObject(user, businessCard));
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();

            return res.status(200).json(users);
        } catch (e) {
            logger.error(e);
            return res.status(400).json({
                status: "bad request",
                code: 400
            });
        }
    }
}

module.exports = new UserController();
