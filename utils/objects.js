const getBusinessCardObject = (businessCard) => {
    return {
        id: businessCard.id,
        user_id: businessCard.userId,
        content: businessCard.content,
        isActivated: businessCard.isActivated
    }
}

const getUserObject = (user, businessCard) => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        isActivated: user.isActivated,
        role: user.role,
        created_at: user.createdAt,
        business_card: businessCard
    }
}

const getApplicationObject = (application) => {
    return {
        id: application.id,
        user_id: application.userId,
        full_name: application.full_name,
        phone_number: application.phone_number
    };
}

module.exports = {
    getBusinessCardObject,
    getUserObject,
    getApplicationObject
}