const sequelize = require('../database');
const {DataTypes} = require('sequelize');

const User = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, primaryKey: true, unique: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, unique: false},
    activationLink: {type: DataTypes.STRING, unique: true},
    isActivated: {type: DataTypes.BOOLEAN, unique: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
});

const Application = sequelize.define('applications', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    full_name: {type: DataTypes.STRING},
    phone_number: {type: DataTypes.STRING, allowNull: true},
    html: {type: DataTypes.STRING},
    css: {type: DataTypes.STRING}
})

const BusinessCard = sequelize.define('business_card', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    html: {type: DataTypes.STRING},
    css: {type: DataTypes.STRING},
    isActivated: {type: DataTypes.BOOLEAN, unique: false},
});

User.hasOne(BusinessCard);
BusinessCard.belongsTo(User);

User.hasOne(Application);
Application.belongsTo(User);

module.exports = {
    User,
    BusinessCard,
    Application
}
