const homeModel = require('../models/homeModel');

const getAgenda = async (req, res) => {
    try {
        const rows = await homeModel.getAgenda();
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            error: "Erro ao buscar agenda."
        });
    }
};

module.exports = {
    getAgenda
};
