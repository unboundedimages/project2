module.exports = function(sequelize, DataTypes) {
    var SearchZip = sequelize.define("SearchZip", {
        zipCode: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [5]
            }
        },
        results: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }
    });
    return SearchZip;
};
