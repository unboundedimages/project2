module.exports = function(sequelize, DataTypes) {
    var SearchLocation = sequelize.define("SearchLocation", {
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2]
            }
        },
        results: {
            type: DataTypes.TEXT,
            allowNull: true,
            len: [1]
        }
    });
    return SearchLocation;
};
